import { Team } from "../model/team.js"
import producer from "../rabbitmq/producer.js";
import axios from 'axios';
/*
    getting a specific team by id 
*/
const getTeam=async(req,res)=>{
    try{
        const teamId=req.params.teamId;
        const teamRes=await Team.findById(teamId);

        console.log(teamRes);

        let membresReq=teamRes.members;
        let teamLeadsReq=teamRes.teamLeads;

        let userRequest={
            members:[],
            teamLeads:[],
        }

        membresReq.forEach((member)=> userRequest.members.push(member.userId));
        teamLeadsReq.forEach((teamLead)=> userRequest.teamLeads.push(teamLead.userId));

        const teamMembersInfo=await axios.post('http://kong-dbless:8000/users/getUsersData',
            userRequest
        );
        
        const { members, teamLeads } = teamMembersInfo.data.content;

        const tasks=await axios.get(`http://kong-dbless:8000/tasks/get/team/${teamId}`);

        const team={
            id:teamRes.id,
            joinCode:teamRes.joinCode,
            name:teamRes.name,
            description:teamRes.description,
            members:members,
            teamLeads:teamLeads,
            tasks:tasks.data.content
        }

        res.status(200).json({status:"good",content:team});
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}

/*
    creating a team for user returning a join code and automaticlliy adding user as team-lead 
*/
const createTeam=async(req,res)=>{
    try{
        const {userId}=req.user;
        const {name,description}=req.body;
        let joinCode;
        do {
            joinCode = Math.random().toString(36).substring(0, 12);
        } while (await Team.findOne({joinCode}));
        const team=new Team({
            name,
            description,
            teamLeads:[{
                userId:userId,
                role:"teamlead"
            }],
            joinCode
        });
        await team.save();
        res.status(201).json({status:"good",content:team});
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}

/*
    updating team by adding users to it
*/
const updateTeam=async(req,res)=>{
    try{
        const {userId}=req.user;
        const teamId=req.params.teamId;
        const team=await Team.findById(teamId);
        const teamUsers=[...team.members];
        const teamLeads=[...team.teamLeads];
        const userList=req.body.users;


        if(!userList){
            return res.status(200).json({status:"good",message:"no one to add"});
        }

        userList.forEach(usr=>{
            const payload={
                userId:usr.userId,
                teamId:teamId,
                role:usr.role,
            }
            producer.sendEvent("UPDATE_USERS",payload);
            
            if(!teamUsers.some(member => member.userId.toString() === usr.userId.toString())){
                teamUsers.push(usr);
            }
            if(usr.role==="teamlead" &&
                !teamLeads.some(lead=> lead.userId.toString()===usr.userId.toString())
            ){
                teamLeads.push(usr);
            }
        });

        await Team.findByIdAndUpdate(teamId, {
            teamLeads:teamLeads,
            members:teamUsers
        }, { new: true });

        res.status(200).json({status:"good",content:"updated"});

    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad",content:err.message});
    }
}

/*
    assigning task to team of users by choiche in the same team
*/
const assignTasksToTeam=async(req,res)=>{
    try{
        const {userId}=req.user;
        const teamId=req.params.teamId;
        const team=await Team.findById(teamId);
        const userList=req.body.users;
        const task=req.body.task;

        if(!userList){
            return res.status(200).json({status:"good",message:"no one to add"});
        }

        userList.forEach(usr=>{
            const payload={
                belongsTo:usr.userId,
                task:task,
                assignedBy:userId
            }
            producer.sendEvent("ASSIGN_TASK",payload);
        });

        res.status(200).json({status:"good",content:"task assigned"});

    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad",content:err.message});
    }

}

/*
    deleting list of users from team
*/
const deleteFromTeam=async(req,res)=>{
    try{
        const {userId}=req.user;
        const teamId=req.params.teamId;

        const team=await Team.findById(teamId);
        const userList=req.body.users;
        const teamList=team.members;
        
        if(!userList){
            return res.status(200).json({status:"good",message:"no one to delete"});
        }

        userList.forEach(usr=>{
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
        res.status(200).json({status:"good",content:"deleted"});

    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}

/*  
    retutning all teams where userId is present and spliting them into where he is team lead and team memeber
*/
const getAllTeams=async(req,res)=>{
    try{
        const {userId}=req.user;
        const teamsWhereMember=await Team.find({"members.userId":userId});
        const teamsWehereLead=await Team.find({"teamLeads.userId":userId});
        res.status(200).json({status:"good",content:{
            lead:teamsWehereLead,
            member:teamsWhereMember,
        }});
    }catch(err){
        console.error(err);
        res.status(500).json({status:"bad", content: err.message});
    }
}
export default{
    createTeam,
    deleteFromTeam,
    getTeam,
    assignTasksToTeam,
    updateTeam,
    getAllTeams
}