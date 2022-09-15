import { describe, it, afterAll, beforeAll } from "@jest/globals";
import { IDatabase } from "../../database/database";
import { Application } from "express";
import request from "supertest";
import { Server } from "http";

/**
 * Tests on the test API so the data all endpoints success
 */
//dont save anything to the filesystem
process.env.JSON_DB_EMPHERAL = "1";
describe("Raw Manga API", () => {
  let app: Application, db: IDatabase, server: Server;
  beforeAll(async () => {
    const _module = await import("../../index");
    app = _module.app;
    db = _module.db;
    server = await _module.initDone;
  });
  afterAll(() =>
    Promise.all([db.close(), new Promise((_) => server.close(_))])
  );
  it("Invalid manga id", async () => {
    await request(app).get("/manga/-1").expect(404);
  });
  it("Valid manga id", async () => {
    await request(app).get("/manga/1").expect(404);
  });
  it("Valid manga id with their own characters", async () => {
    await request(app).get("/manga/1/characters").expect(404);
  });
  it("All mangas", async () => {
    await request(app).get("/manga/all").expect(200);
  });
  it("Search", async () => {
    await request(app).get("/manga/search?q=a").expect(200);
  });
  it("Categories", async () => {
    await request(app).get("/manga/categories").expect(200);
  });
  it("Person", async () => {
    await request(app).get("/manga/persons").expect(200);
  });
  it("Person with specific id", async () => {
    await request(app).get("/manga/person/1").expect(200);
  });
});
