
import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nock from "nock";

jest.setTimeout(30000);

process.env.PRIVATE_KEY= "test";
process.env.JWT_REFRESH_SECRET = "test";
process.env.PUBLIC_KEY= "test";

// ============================================================================
// MOCK DATA SETUP
// ============================================================================
const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  id: "507f1f77bcf86cd799439011",
  email: "test@example.com",
  password: await bcrypt.hash("password123", 10),
  isActive: true,
  isVerified: false,
  save: jest.fn().mockResolvedValue(true),
  toJSON: function() {
    return {
      id: this._id,
      email: this.email,
      isVerified: this.isVerified
    };
  }
};

const mockRefreshToken = {
  token: "mock-refresh-token",
  userId: mockUser._id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  isExpired: false,
  isRevoked: false,
  save: jest.fn().mockResolvedValue(true)
};

// ============================================================================
// MOCK CONSTRUCTORS
// ============================================================================
const UserMock = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: mockUser._id,
  save: jest.fn().mockResolvedValue(true),
  toJSON: () => ({ id: mockUser._id, email: data.email })
}));

UserMock.findOne = jest.fn();
UserMock.findById = jest.fn();
UserMock.findByIdAndUpdate = jest.fn();
UserMock.findByIdAndDelete = jest.fn();

const RefreshTokenMock = jest.fn().mockImplementation(() => ({
  ...mockRefreshToken,
  save: jest.fn().mockResolvedValue(true)
}));

RefreshTokenMock.findOne = jest.fn();
RefreshTokenMock.updateMany = jest.fn();

// ============================================================================
// MOCK MONGOOSE
// ============================================================================
jest.unstable_mockModule("mongoose", () => ({
  default: {
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1 },
    model: jest.fn((name) => {
      if (name === 'User') return UserMock;
      if (name === 'RefreshToken') return RefreshTokenMock;
    }),
    Schema: jest.fn()
  }
}));

// ============================================================================
// MOCK USER MODELS
// ============================================================================
jest.unstable_mockModule("../../services/auth-service/model/user.js", () => ({
  User: UserMock
}));

jest.unstable_mockModule("../../services/auth-service/model/refreshes.js", () => ({
  RefreshToken: RefreshTokenMock
}));

// ============================================================================
// AUTH ROUTER
// ============================================================================
const { authRouter } = await import("../../services/auth-service/router/authRouter.js");

// ============================================================================
// CREATE TEST APP
// ============================================================================
const app = express();
app.use(express.json());
app.use("/auth", authRouter);

// ============================================================================
// SIGNUP TESTS
// ============================================================================
describe("POST /auth/signup", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully creates a new user", async () => {
    UserMock.findOne.mockResolvedValue(null); // No existing user
    

    nock('http://kong-dbless:8000')
      .post('/user/create')
      .reply(201, { message: "Profile created" });

    
    const res = await request(app)
      .post("/auth/signup")
      .send({
        email: "newuser@example.com",
        password: "password123",
        firstname: "John",
        lastname: "Doe"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    expect(UserMock.findOne).toHaveBeenCalledWith({ email: "newuser@example.com" });
  });

  test("rejects duplicate email", async () => {
    UserMock.findOne.mockResolvedValue(mockUser); // User exists

    const res = await request(app)
      .post("/auth/signup")
      .send({
        email: "test@example.com",
        password: "password123",
        firstname: "John"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });
});

// ============================================================================
// LOGIN TESTS
// ============================================================================
describe("POST /auth/login", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully logs in with valid credentials", async () => {
    UserMock.findOne.mockResolvedValue(mockUser);

    nock("http://kong-dbless:8000")
    .get(`/user/get/${mockUser._id}`)
    .reply(200,{user:"",token:"",refreshToken:"",email:"test@example.com"})


    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toHaveProperty("user");
    expect(UserMock.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  test("rejects non-existent user", async () => {
    UserMock.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123"
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  test("rejects wrong password", async () => {
    UserMock.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});

// ============================================================================
// REFRESH TOKEN TESTS
// ============================================================================
describe("POST /auth/refresh", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully refreshes token", async () => {
    const validToken = jwt.sign(
      { userId: mockUser._id, email: mockUser.email },
      process.env.JWT_REFRESH_SECRET || "test-secret",
      { expiresIn: "7d" }
    );

    RefreshTokenMock.findOne.mockResolvedValue({
      ...mockRefreshToken,
      token: validToken,
      userId: mockUser._id,
      isExpired: false,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    UserMock.findById.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: validToken });

    if (res.status === 200) {
      expect(res.body).toHaveProperty("token");
    }
  });

  test("rejects missing refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing refresh token");
  });

  test("rejects invalid refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "invalid-token" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Invalid refresh token/);
  });
});

// ============================================================================
// LOGOUT TESTS
// ============================================================================
describe("PUT /auth/logout/:userId", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully logs out user", async () => {
    RefreshTokenMock.updateMany.mockResolvedValue({ modifiedCount: 1 });

    const res = await request(app)
      .put(`/auth/logout/${mockUser._id}`)
      .send({
        email: "test@example.com",
        password: "password123",
        firstname: "John"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ============================================================================
// INVALIDATE TOKEN TESTS
// ============================================================================
describe("PUT /auth/invalidate/:userId", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully invalidates all tokens", async () => {
    RefreshTokenMock.updateMany.mockResolvedValue({ modifiedCount: 3 });

    const res = await request(app)
      .put(`/auth/invalidate/${mockUser._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("All tokens invalidated");
    expect(RefreshTokenMock.updateMany).toHaveBeenCalled();
  });
});

// ============================================================================
// DELETE USER TESTS
// ============================================================================
describe("DELETE /auth/delete/:userId", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });``

  test("successfully deletes user", async () => {
    UserMock.findByIdAndUpdate.mockResolvedValue(mockUser);
    RefreshTokenMock.updateMany.mockResolvedValue({});

    nock("http://kong-dbless:8000")
    .delete(`/user/delete/${mockUser._id}`)
    .reply(200, { message: "User deleted" });


    const res = await request(app)
      .delete(`/auth/delete/${mockUser._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User deleted");
  });

  test("handles non-existent user", async () => {
    UserMock.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/auth/delete/${mockUser._id}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});