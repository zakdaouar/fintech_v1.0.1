import request from "supertest";
import appInit from "./testServer.js";

let app;
beforeAll(() => { app = appInit(); });

test("signup & login flow", async () => {
  const email = `user${Date.now()}@example.com`;
  const signup = await request(app).post("/api/auth/signup").send({ email, password: "Password123!", name: "Tester" });
  expect(signup.status).toBe(201);
  expect(signup.body.token).toBeTruthy();

  const login = await request(app).post("/api/auth/login").send({ email, password: "Password123!" });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
});
