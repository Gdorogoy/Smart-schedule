import jwt from "jsonwebtoken";
import { RefreshToken } from "../model/refreshes.js";
import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import axios from "axios";
import { JWT_REFRESH_SECRET, PRIVATE_KEY } from "../config/config.js";




/*
  Generating tokens( refresh and accsses) for user
*/
const generateTokens = (user) => {
  const payload = { userId: user.id, email: user.email };
  const token = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { token, refreshToken };
};

/*
  refreshing the accsses token
  checking if the refresh token is valid first
*/
const refreshToken = async (req, res) => {
  try {
    const { refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token" });
    }


    let decoded=null;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      userId:decoded.userId
    });

    if (!tokenDoc) {
      return res.status(404).json({ error: "Token not found" });
    }

    if (tokenDoc.userId.toString() !== decoded.userId) {
      return res.status(403).json({ error: "User mismatch" });
    }

    if (tokenDoc.isExpired || tokenDoc.isRevoked) {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }

    if (new Date() > tokenDoc.expiresAt) {
      tokenDoc.isExpired = true;
      await tokenDoc.save();
      return res.status(401).json({ error: "Token expired. Please log in again."});
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "15m",
    });


    return res.json({ token: token });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

/*
  registerating user adding the user to userprofile database via user-service
    adding user to user database adding token to token database
    returning tokens and user info
*/
const createUser = async (req, res) => {
  try {
    const { email, firstname, lastname, timeZone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    try {
      const profileResponse = await axios.post(
        `http://kong-dbless:8000/user/create`,
        {
          userId: user._id.toString(),
          email: user.email,
          firstname:firstname,
          lastname: lastname || "",
          timeZone: timeZone || "UTC"
        }
      );

    console.log("User Service responded:", profileResponse.data);
    if (profileResponse.status !== 201) {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ error: "User service failed to create profile" });
      }

    } catch (userServiceError) {
      console.error(" User Service error:", userServiceError.message);
      
      await User.findByIdAndDelete(user._id);
      
      return res.status(500).json({ 
        error: "Failed to create user profile",
        details: userServiceError.response?.data || userServiceError.message
      });
    }


    const { token, refreshToken } = generateTokens({
      id: user._id,
      email: user.email
    });

    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    });

    await refreshTokenDoc.save();


    return res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstname,
        lastname: lastname || "",
        timeZone: timeZone || "UTC"
      }
    });

  } catch (err) {
    console.error("Error in createUser:", err.message);
    return res.status(500).json({ error: err.message });
  }
};


/*
  loging in user if password and email match and giving him tokens 
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const authUser=await User.findOne({email});
    if (!authUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, authUser.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userId=authUser.id;
    console.log(authUser);
    console.log(userId);

    const response = await axios.get(
  `http://kong-dbless:8000/user/get/${authUser.id}`);
  
    const user = response.data;
  

    const { token, refreshToken } = generateTokens({
      id: authUser.id,
      email: authUser.email
    });

    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: authUser.id
    });

    await refreshTokenDoc.save();

    authUser.lastLogin = new Date();
    await authUser.save();

    return res.status(200).json({
      token,
      refreshToken,
      user,
    });


  } 
    catch (err) {
      res.status(500).json({ error: err.message });
  }
};

/*
  invalidating user token for logout
*/
const invalidateToken = async (req, res) => {
  try {
    const { userId } = req.params;

    await RefreshToken.updateMany(
      { userId },
      { isRevoked: true, isExpired: true }
    );

    res.json({ success: true, message: "All tokens invalidated" });

  } catch (err) {
    console.error("Error invalidating tokens:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/*
  deleting user and its tokens,profile 
*/
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await RefreshToken.updateMany(
      { userId },
      { isRevoked: true, isExpired: true }
    );

    try {
      await axios.delete(` http://kong-dbless:8000/user/delete/${userId}`);
      console.log("User Service notified of deletion");
    } catch (error) {
      console.error("User Service deletion failed:", error.message);
      return res.status(500).json({err:error});
    }

    return res.status(200).json({ success: true, message: "User deleted" });

  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export default { 
  createUser, 
  login, 
  refreshToken,
  deleteUser,
  invalidateToken
};
