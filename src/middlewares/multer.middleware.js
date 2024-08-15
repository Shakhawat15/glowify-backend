import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({ storage });

const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

export const upload = multer({ storage });
