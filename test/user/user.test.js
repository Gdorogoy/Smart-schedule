import request from "supertest"
import { describe, expect, jest, test } from "@jest/globals";
import { User } from "../../services/user-service/model/user.js";
import express from "express";



const mockUser = {
  id: "507f191e810c19729de860ea",
  userId: "87812jfdd88323ds",
  email: "john.doe@example.com",
  firstname: "John",
  lastname: "Doe",
  timeZone: "UTC",
  avatar: "https://example.com/avatar.png",
  bio: "Full-stack developer",
  preferences: {
    notifications: true,
    theme: "dark"
  },
  teams: [
    {
      teamId: "507f1f77bcf86cd799439011",
      role: "admin",
      joinedAt: "2024-01-15T10:00:00.000Z"
    }
  ],
  createdAt: "2024-01-01T08:00:00.000Z",
  updatedAt: "2024-06-01T08:00:00.000Z"
};


jest.unstable_mockModule(
    "../../services/user-service/middleware/authVerifyMiddleware.js",
    () => ({
        verifyRequest: (req, res, next) => {
        req.user = {
            userId: mockUser.userId,
            email: mockUser.email,
        };
        next();
        },
    })
);  

const UserMock=jest.fn().mockImplementation((data)=>({
    ...data,
    id:mockUser.id,
    save:jest.fn().mockResolvedValue(true),
    toJson:function(){
        return {
            id: this.id,
            userId: this.userId,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            timeZone: this.timeZone,
            avatar: this.avatar,
            bio: this.bio,
            preferences: this.preferences,
            teams: this.teams,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}));


UserMock.find=jest.fn();
UserMock.findOne=jest.fn();
UserMock.findById=jest.fn();
UserMock.findByIdAndUpdate=jest.fn();
UserMock.findByIdAndDelete=jest.fn();
UserMock.create=jest.fn();
UserMock.findOneAndUpdate=jest.fn();


jest.unstable_mockModule("mongoose", ()=>({
    default:{
        connect:jest.fn().mockResolvedValue(true),
        connection:{readyState:1},
        model:jest.fn(name=>{
            if(name==="User"){
                return UserMock;
            }
        }),
        Schema:jest.fn()
    }
}));

jest.unstable_mockModule("../../services/user-service/model/user.js",()=>({
        User:UserMock
    }
));

const {userRouter}=await import("../../services/user-service/router/userRouter.js");


const app=express();
app.use(express.json());
app.use("/users",userRouter);



describe("GET /users/" ,()=>{
    test("get user by id",async()=>{
        UserMock.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
        .get("/users/get/87812jfdd88323ds");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("good");
 
    });
});


describe("PUT /users/" ,()=>{

    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("update user", async () => {
        UserMock.findOneAndUpdate.mockResolvedValue({
            ...mockUser,
            email: "test@mail.com",
        });

        const res = await request(app)
            .put("/users/update")
            .set("Authorization", "Bearer faketoken")
            .send({
            firstname: "Test",
            lastname: "User",
            timeZone: "UTC",
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("good");
            expect(res.body.content.email).toBe("test@mail.com");
        });

});



describe("POST /users/" ,()=>{
    test("create user",async()=>{
        UserMock.create.mockResolvedValue(mockUser);

        const res=await request(app)
        .post("/users/create")
        .send(mockUser);

        expect(res.status).toBe(201);
    });
});


describe("DELETE /users/" ,()=>{
    test("delete user",async()=>{
        UserMock.findByIdAndDelete.mockResolvedValue(null);

        const res=await request(app)
        .delete(`/users/delete/`);

        expect(res.status).toBe(200);
    });
});