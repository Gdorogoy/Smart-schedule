import { User } from "../model/user.js";

class UserEventHandlers{
    addUserToTeam = async (message) => {
        try {
            const { userId, teamId, role } = message.payload;
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            let existingTeam = user.teams.find(
                t => t.teamId.toString() === teamId);

            if (existingTeam) {
                existingTeam.role = role;
            } else {
                user.teams.push({
                    teamId: teamId,
                    role: role,
                    joinedAt: new Date(),
                });
            }
            await user.save();
        } catch (err) {
            throw err;
        }
    };
    deleteUserFromTeam=async(message)=>{
        try{
            const { userId, teamId, role } = message.payload;
            const user = await User.findById(userId);
            if (!user) {
                    throw new Error(`User not found`);
            }

            let existingTeam=user.teams.find(
                t=>t.teamId.toString()=== teamId);
            if(!existingTeam){
                throw new Error(`User wasnt in team`);
            }
            const filtredTeams=user.teams.filter(t=>{
                t.teamId.toString()!==teamId
            });

            user.teams=filtredTeams;

            await user.save();

        }catch(err){

        }
    }
}

export default new UserEventHandlers;