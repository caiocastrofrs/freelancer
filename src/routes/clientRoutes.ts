import { Router } from "express";

const clientRoutes = Router({ mergeParams: true });

clientRoutes.post("/", createClient);
clientRoutes.put(":clientId", updateClient);
clientRoutes.delete(":clientId", deleteClient);

export default clientRoutes;
