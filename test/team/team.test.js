import request from "supertest"
import { describe, expect, jest, test } from "@jest/globals";
import express from "express";



jest.unstable_mockModule("mongoose", ()=>({
    default:{
        connect:jest.fn().mockResolvedValue(true),
        connection:{readyState:1},
        model:jest.fn(name=>{
            if(name==="Teams"){
                return TeamMock;
            }
        }),
        Schema:jest.fn()
    }
}));


const producerMock = {
  default: {
    sendEvent: jest.fn(),
  },
};

await jest.unstable_mockModule('../../services/team-service/rabbitmq/producer.js', () => producerMock);



export const mockTeam= {
  id: "507f1f77bcf86cd799439011",
  name: "Backend Team",
  description: "Handles all backend services and APIs",

  teamLeads: [
    "507f191e810c19729de860ea"
  ],

  members: [
    {
      userId: "507f191e810c19729de860eb",
      role: "admin",
      joinedAt: "2024-01-10T10:00:00.000Z",
    },
    {
      userId: "507f191e810c19729de860ec",
      role: "member",
      joinedAt: "2024-02-01T12:00:00.000Z",
    },
  ],

  joinCode: "JOIN12345",

  createdAt: "2024-01-01T08:00:00.000Z",
  updatedAt: "2024-06-01T08:00:00.000Z",
};


jest.unstable_mockModule("../../services/team-service/middleware/authMiddleware", ()=>({
    verifyRequest:(req,res,next)=>{
        req.user= { userId: "507f191e810c19729de860eb" };
        next();
    }
}));


const TeamMock=jest.fn().mockImplementation((data)=>({
    ...data,
    id:mockTeam.id,
    save:jest.fn().mockResolvedValue(true),
    toJson:function(){
        return{
            id: this.id.toString(),
            name: this.name,
            description: this.description,
            teamLeads: this.teamLeads,
            members: this.members,
            joinCode: this.joinCode,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}));


TeamMock.find = jest.fn();
TeamMock.findOne=jest.fn();
TeamMock.findByIdAndUpdate=jest.fn();
TeamMock.findByIdAndDelete=jest.fn();
TeamMock.create=jest.fn();
TeamMock.findById=jest.fn();
TeamMock.findOneAndUpdate=jest.fn();


jest.unstable_mockModule("../../services/team-service/model/team.js", ()=>{
    return {Team:TeamMock}
})

const { router } = await import(
  "../../services/team-service/router/teamRoueter.js"
);

const app=express();
app.use(express.json());
app.use("/teams",router);

describe("GET /teams/",()=>{
  test("get team by id",async()=>{
    TeamMock.findById.mockResolvedValue(true);

    const res=await request(app)
    .get(`/teams/get/${mockTeam.id}`)
    .set("Authorization", "Bearer faketoken")

    expect(res.status).toBe(200);

  });
  test("get all user teams",async()=>{
      TeamMock.find
        .mockResolvedValueOnce([mockTeam])
        .mockResolvedValueOnce([mockTeam]);

      const res = await request(app)
      .get("/teams/getAll")
      .set("Authorization", "Bearer faketoken");


      expect(res.status).toBe(200);

  });
});

describe("POST /teams/",()=>{
  test("create team",async()=>{
    TeamMock.create.mockResolvedValue(mockTeam);
    const res=await request(app)
    .post("/teams/create")
    .set("Authorization", "Bearer faketoken")
    .send(mockTeam);

    expect(res.status).toBe(201);
  });
});

describe("DELETE /teams/",()=>{
  test("delete team",async()=>{
    TeamMock.findByIdAndDelete.mockResolvedValue(null);

    const res=await request(app)
    .delete(`/teams/delete/${mockTeam.id}`)
    .send({userList:[1]})
    .set("Authorization", "Bearer faketoken")
    

    expect(res.status).toBe(200);
  });
});

describe("PUT /teams/",()=>{
  test("assign to team /assign",async()=>{
    TeamMock.findById.mockResolvedValue(mockTeam);
    const taskPayload = {
      users: [
        { userId: "507f191e810c19729de860eb" },
      ],
      task: {
        title: "Test Task",
        description: "Do something important",
        assignedBy: "507f191e810c19729de860eb",
        due: "2025-12-31",
        importance: 10
      }
    };

        const res = await request(app)
      .put(`/teams/assign/${mockTeam.id}`)
      .set("Authorization", "Bearer faketoken")
      .send(taskPayload);

    expect(res.status).toBe(200);
  });
  test("update team /update",async()=>{
    TeamMock.findById.mockResolvedValue({ 
      ...mockTeam,
      members: [...mockTeam.members],
       teamLeads: mockTeam.teamLeads.map(id => ({ userId: id }))
    });

    const res = await request(app)
    .put(`/teams/update/${mockTeam.id}`)
    .set("Authorization", "Bearer faketoken")
    .send({users:[{ userId: "507f191e810c19729de860ec", role: "teamlead" }]});
    
    expect(res.status).toBe(200);

  });
});