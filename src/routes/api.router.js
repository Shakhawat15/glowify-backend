import express from "express";
import userRouter from "./user.router.js";
import userRoleRouter from "./user_role.router.js";
import addressRouter from "./address.router.js";
import blogRouter from "./blog.router.js";
import brandRouter from "./brand.router.js";
import categoryRouter from "./category.router.js";
import orderRouter from "./order.router.js";
import productRouter from "./product.router.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/user-roles", userRoleRouter);
apiRouter.use("/addresses", addressRouter);
apiRouter.use("/blogs", blogRouter);
apiRouter.use("/brands", brandRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/products", productRouter);

export default apiRouter;
