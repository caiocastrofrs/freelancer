import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app.js";
import User from "../../src/models/User.js";

describe("GET /api/users/:userId", () => {
  let userId: string;

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const user = await User.create({
      username: "testerino",
      email: "testerino@example.com",
      password: "shhhhh",
    });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("returns 200 and the user when found", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testerino");
  });

  it("returns 404 when user does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/api/users/${fakeId}`);

    expect(response.status).toBe(404);
  });

  it("returns 400 when id is not a valid ObjectId", async () => {
    const response = await request(app).get("/api/users/invalid-id");

    expect(response.status).toBe(400);
  });
});
