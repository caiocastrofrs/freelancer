import express from "express";
import userRoutes from "./routes/userRoutes.js";
// import clientRoutes from "./routes/clientRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";
// import deliveryRoutes from "./routes/deliveryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/users/:userId/clients", clientRoutes);
// app.use("/api/users/:userId/clients/:clientId/projects", projectRoutes);
// app.use(
//   "/api/users/:userId/clients/:clientId/projects/:projectId/deliveries",
//   deliveryRoutes,
// );

app.use(errorHandler);

export default app;
