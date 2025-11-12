import { Team } from "../model/team"
import producer from "../rabbitmq/producer";

const getTeam=async(req,res)=>{
    try{
        const {teamId}=req.team;
        const team=await Team.findById(teamId);
        res.status(200).json({status:"good",content:team});
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}
const createTeam=async(req,res)=>{
    try{
        const {teamId,userId}=req.team;
        const {name,description}=req.body;
        let joinCode;
        do {
            joinCode = Math.random().toString(36).substring(0, 12);
        } while (await Team.findOne({joinCode}));
        const team=new Team({
            name,
            description,
            teamLeads:[userId],
            joinCode
        });
        await team.save();
        res.status(201).json({status:"good",content:team});
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}
const updateTeam=async(req,res)=>{
    try{
        /*  req.body={
            users:{
                usr:{
                    id,role?
                }
                usr:{
                    id,role?
                }
                usr:{
                    id,role?
                }        
            }
        }
        */  
        const {teamId,userId}=req.team;
        const team=await Team.findById(teamId);
        const teamUsers=team.members;
        const teamLeads=team.teamLeads;
        const userList=req.body.users;


        /*
            sending each user as a message then letting the user service to update it;
            then adding each new user or updated user to temp list 
        */

        userList.map(usr=>{
            const payload={
                userId:usr.userId,
                teamId:teamId,
                role:usr.role,
            }
            producer.sendEvent("UPDATE_USERS",payload);
            if(!teamUsers.some(member => member.userId.toString() === usr.userId.toString())){
                teamUsers.push(usr);
            }
            if(usr.role==="teamlead"){
                teamLeads.push(usr);
            }
        });

        await Team.findByIdAndUpdate(teamId, {
            teamLeads:teamLeads,
            members:teamUsers
        }, { new: true });

        res.status(200).json({status:"good",content:"updated"});



        /*
            {userId,teamId}
            {updatedFields}

            send message from team-serivce to user-service to update the user/s

            for e.x : add user x to team 1 :
            send message to user-service to update user x {teams[...,team1.id , role:member]} 
            update user z role to team_lead in team 2:
            send message to user-service to update user x {teams[...,team1.id],role:team_lead} 
            give task to user x,y,z:
            send message to task service with the task info and the ids of users x y z

        */  


    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad",content:err.message});
    }
}

const assingTasksToTeam=async(req,res)=>{
    try{
        const {teamId,userId}=req.team;

        const team=await Team.findById(teamId);
        const userList=req.body.users;
        const task=req.body.task;

        // {
        //     users:{
        //         usr:{
        //             id
        //         }
        //     },
        //     task:{
        //         title,
        //         description,
        //         assignedBy,
        //         due,
        //         importance,
        //         assignedBy(teamid)
        //     }
        // }
        /*
            sending each user as a message then letting the task service to handle it;
        */

        userList.map(usr=>{
            const payload={
                belongsTo:usr.userId,
                task:task,
                assignedBt
            }
            producer.sendEvent("ASSIGN_TASK",payload);
        });

        res.status(200).json({status:"good",content:"task assigned"});

    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad",content:err.message});
    }

}
const deleteFromTeam=async(req,res)=>{
    try{
        const {teamId,userId}=req.team;

        const team=await Team.findById(teamId);
        const userList=req.body.users;
        const teamList=team.members;
        

        /*
            1st send event to clear all users task from this team (taks service)
            2nd send event to remove team from users teams:[team1:{},team2:{},team_to_delte:{team_id,role}] (user servie);
            3th update the team so it would not contain the delted user;
        */

        userList.map(usr=>{
            const payload={
                userId:usr.userId,
                teamId:teamId
            }
            producer.sendEvent("team.task.delete",payload);
            producer.sendEvent("team.user.delete",payload);
        });
        const updatedMembers = teamList.filter(memb => 
            !userList.some(usr => memb.userId.toString() === usr.userId.toString())
        );
        await Team.findByIdAndUpdate(teamId, { members: updatedMembers });
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}

export default{
    createTeam,
    deleteFromTeam,
    getTeam,
    assingTasksToTeam,
    updateTeam
}