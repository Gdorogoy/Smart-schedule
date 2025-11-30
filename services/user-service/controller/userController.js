import { User } from "../model/user.js";

const createUser = async (req, res) => {
  try {
    const {firstname,lastname,timeZone,email,userId}=req.body;
    const user = {
        userId,
        email,
        firstname,
        lastname,
        timeZone,
    };

    console.log(user);

    if (!user || !user.email) {
      return res.status(400).json({ status: "bad", content: "Missing user data" });
    }

    const userToSave = new User({
        userId: user.userId,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname || "",
        timeZone: user.timeZone || "UTC",
    });

    await userToSave.save();

    console.log("created user");

    return res.status(201).json({status:"good",content:userToSave});

  } catch (err) {
    console.error("createUser error:", err.message);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};



const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ userId });



    if (!user) {
      return res.status(404).json({ status: "bad", content: "User not found" });
    }

    return res.status(200).json({ status: "good", content: user });

  } catch (err) {
    return res.status(500).json({ status: "bad", content: err.message });
  }
};



const updateUser = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { firstname, lastname, timeZone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { email, firstname, lastname, timeZone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "bad", content: "User not found" });
    }

    return res.status(200).json({ status: "good", content: updatedUser });

  } catch (err) {
    return res.status(500).json({ status: "bad", content: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const userProfile = await User.findOneAndUpdate(
      { userId },
      { isActive: false, deletedAt: new Date() },
      { new: true }
    );

    if (!userProfile) {
      return res.status(404).json({ status: "bad", content: "User not found" });
    }

    return res.status(200).json({ status: "good", content: userProfile });

  } catch (err) {
    return res.status(500).json({ status: "bad", content: err.message });
  }
};



export default{
    findUser,
    updateUser,
    deleteUser,
    createUser,
}