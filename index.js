import request from "supertest";
import express from "express";
import taskRouter from "../../services/task-service/router/taskRouter.js";

// Mocks
import Task from "../../services/task-service/model/task.js";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("../../services/task-service/model/task.js");
jest.mock("axios");
jest.mock("jsonwebtoken");

// Fake auth middleware
// jest.mock("../../services/task-service/middleware/authMiddleware.js", () => ({
//   verifyRequest: (req, res, next) => {
//     req.user = { userId: "mockUser" };
//     next();
//   }
// }));

const app = express();
app.use(express.json());
app.use("/tasks", taskRouter);

/* ------------------------------------------------------
   TASK SERVICE — TEST SUITE (ALL IN ONE PLACE)
------------------------------------------------------ */
describe("TASK SERVICE", () => {

  /* ---------------------- CREATE ---------------------- */
  describe("CREATE TASK", () => {
    test("should create a task", async () => {
      const mockTask = {
        title: "Finish backend API",
        description: "Implement endpoints",
        importance: 8,
        start: "2025-11-21T10:00:00.000Z",
        end: "2025-11-21T12:00:00.000Z",
        color: "#FF5733"
      };

      Task.prototype.save = jest.fn().mockResolvedValue({
        ...mockTask,
        _id: "task123",
        belongsTo: "user123",
        status: "pending"
      });

      const res = await request(app)
        .post("/tasks/user123")
        .send(mockTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.stats).toBe("good");
      expect(res.body.content.title).toBe(mockTask.title);
    });
  });

  /* ---------------------- FIND ------------------------ */
  describe("FIND TASKS", () => {
    test("should return all tasks for a user", async () => {
      Task.find = jest.fn().mockResolvedValue([
        {
          _id: "task123",
          title: "Test",
          belongsTo: "user123"
        }
      ]);

      const res = await request(app).get("/tasks/user123");

      expect(res.statusCode).toBe(200);
      expect(Task.find).toHaveBeenCalledWith({ belongsTo: "user123" });
      expect(res.body.stats).toBe("good");
    });
  });

  /* ---------------------- UPDATE ---------------------- */
  describe("UPDATE TASK", () => {
    test("should update task", async () => {
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: "task123",
        title: "Updated Task",
        description: "Updated desc",
        belongsTo: "user123",
        importance: 7
      });

      const body = {
        title: "Updated Task",
        description: "Updated desc",
        importance: 7
      };

      const res = await request(app)
        .put("/tasks/user123/task123")
        .send(body);

      expect(res.statusCode).toBe(200);
      expect(res.body.stats).toBe("good");
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "task123",
        body,
        { new: true }
      );
    });
  });

  /* ---------------------- DELETE ---------------------- */
  describe("DELETE TASK", () => {
    test("should delete a task", async () => {
      Task.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: "task123",
        title: "Some task"
      });

      const res = await request(app)
        .delete("/tasks/user123/task123");

      expect(res.statusCode).toBe(200);
      expect(res.body.stats).toBe("good");
    });
  });
});
