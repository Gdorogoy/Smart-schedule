import { describe, expect, jest, test } from "@jest/globals";
import express from "express";
import request from "supertest";
import Test from "supertest/lib/test";
import {  Task} from "../../services/task-service/model/task.js";


// ============================================================================
// MOCK DATA
// ============================================================================
const mockTask={
    _id:"507f1f77bcf86cd799439011",
    id:"507f1f77bcf86cd799439011",
    title: "Review Q3 Financial Reports",
    description: "Analyze the reports submitted by the accounting department, focusing on variance analysis and profitability metrics for the last quarter.",
    importance: 9,
    start: "2025-10-30T09:00:00.000Z",
    end: "2025-11-05T17:00:00.000Z",
    color: "#10B981",
    status: "in-progress",
    belongsTo: "653cf1e4f4a3b8c3d8e9a2b1",
    save:jest.fn().mockResolvedValue(true),
    toJSON:  function(){
        return{
            id:this._id
        };
    }
}


// ============================================================================
// MOCK CONSTRUCTORS
// ============================================================================
const TaskMock=jest.fn().mockImplementation((data)=>({
    ...data,
    _id:mockTask.id,
    
    save:jest.fn().mockResolvedValue(true),
    toJSON: function () {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      importance: this.importance,
      start: this.start,
      end: this.end,
      color: this.color,
      status: this.status,
      belongsTo: this.belongsTo
    };
  }
}));

TaskMock.find = jest.fn();
TaskMock.findOne=jest.fn();
TaskMock.findById=jest.fn();
TaskMock.findByIdAndUpdate=jest.fn();
TaskMock.findByIdAndDelete=jest.fn();
TaskMock.create=jest.fn();



// ============================================================================
// MOCK MONGOOSE
// ============================================================================
jest.unstable_mockModule("mongoose", () => ({
  default: {
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1 },
    model: jest.fn((name) => {
      if (name === 'Task') return TaskMock;
    }),
    Schema: jest.fn()
  }
}));


// ============================================================================
// MOCK TASK MODEL
// ============================================================================

jest.unstable_mockModule("../../services/task-service/model/task.js",()=>({
  Task:TaskMock
}));


// ============================================================================
// TASK ROUTER
// ============================================================================

const {taskRouter}= await import("../../services/task-service/router/taskRouter.js");


// ============================================================================
// CREATE TEST APP
// ============================================================================

const app=express();
app.use(express.json());
app.use("/tasks",taskRouter);


// describe("something",()=>{
//     test1("test",async()=>{
//         test
//     })
// })

describe("POST /tasks/create",()=>{
      
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates new task",async()=>{
    const res = await request(app)
    .post("/tasks/create/653cf1e4f4a3b8c3d8e9a2b1")
    .send({
      title: "Review Q3 Financial Reports",
      description: "Analyze the reports submitted by the accounting department, focusing on variance analysis and profitability metrics for the last quarter.",
      importance: 9,
      start: "2025-10-30T09:00:00.000Z",
      end: "2025-11-05T17:00:00.000Z",
      color: "#10B981",
      status: "in-progress",
      belongsTo: "653cf1e4f4a3b8c3d8e9a2b1"
    });
    expect(res.status).toBe(201);
    expect(res.body.content).toHaveProperty("title");
    expect(res.body.content).toHaveProperty("belongsTo");


  })
});

describe("PUT /tasks/update",()=>{

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("updates and task",async()=>{
    TaskMock.findByIdAndUpdate.mockResolvedValue({
      ...mockTask,
      importance: 4,            
      toJSON: function() { 
        return { ...this };
      }
    });

    const res=await request(app)
    .put("/tasks/update/653cf1e4f4a3b8c3d8e9a2b1/507f1f77bcf86cd799439011")
    .send({importance:4});

    expect(res.status).toBe(200);
    expect(res.body.content.importance).toBe(4);

  });
});


describe("GET /tasks/get",()=>{
  test("get tasks ",async()=>{
    TaskMock.findOne.mockResolvedValue(mockTask.belongsTo);
    const res=await request(app)
    .get("/tasks/get/653cf1e4f4a3b8c3d8e9a2b1");

    expect(res.status).toBe(200);
    expect(res.body.stats).toBe("good");
  });
});


describe("DELETE /tasks/delete",()=>{
  test("delete task",async()=>{
    TaskMock.findByIdAndDelete.mockResolvedValue(mockTask._id);

    const res=await request(app)
    .delete("/tasks/delete/653cf1e4f4a3b8c3d8e9a2b1/507f1f77bcf86cd799439011")

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Task deleted successfully");

  });
});



