import mongoose from "mongoose";
import app from "./app.js";
import { config } from "dotenv";

const PORT = process.env.PORT || 3000;

config({ debug: true });

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:\n", err));
