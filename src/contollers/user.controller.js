import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Generate Access Token and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

// Reister User
const registerUser = asyncHandler(async (req, res) => {
  const { role_id, first_name, last_name, email, phone, password, status } =
    req.body;

  if (
    [first_name, last_name, email, phone, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await UserModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(409, "Email or phone already exists");
  }

  const photoLocalPath = req.file?.path;

  //   Upload On Cloudinary
  //   const photo = await uploadOnCloudinary(photoLocalPath);

  const user = await UserModel.create({
    role_id,
    first_name,
    last_name,
    email,
    phone,
    password,
    photo_path: photoLocalPath || "",
    status,
  });

  const createdUser = await UserModel.findById(user._id).select(
    "-password -refresh_token"
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refresh_token"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: { refresh_token: "" } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
