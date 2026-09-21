import { Router } from "express";

const projectRoutes = Router({ mergeParams: true });

projectRoutes.post("/", createProject);
projectRoutes.put(":projectId", updateProject);
projectRoutes.delete(":projectId", deleteProject);

export default projectRoutes;
