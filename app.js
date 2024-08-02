import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running....");
});

// Importing routes
import apiRouter from "./src/routes/api.router.js";

app.use("/api/v1", apiRouter);

app.use("/*", (req, res) => {
  res.status(404).send("Page Not Found");
});

export { app };
