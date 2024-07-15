import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed!!", error);
  });
