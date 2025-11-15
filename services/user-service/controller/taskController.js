import axios from 'axios'


 // todo: change all of the urls to http://api-gateway for deployment 

const getAll = async (req, res, next) => {
  try {
    const userId = String(req.params.userId);

    const taskResponse = await axios.get(
      `http://localhost:3004/api/v1/tasks/${userId}`
    );

    return res.status(200).json({
      status: "good",
      content: taskResponse.data,
    });

  } catch (err) {
    return next(err);
  }
};


const createTask = async (req, res,next) => {
    try {

        const userId = String(req.params.userId);
        const taskBody = req.body;
        
        const taskResponse = await axios.post(
            `http://localhost:3004/api/v1/tasks/${userId}`,
            taskBody
        );
        res.status(200).json({ status: "good", content: taskResponse.data });

    } catch (err) {
        next(err);
    }
};
const updateTask=async(req,res,next)=>{
    try {

        const userId = String(req.params.userId);
        const taskId= String(req.params.taskId);
        const taskBody = req.body;
        
        const taskResponse = await axios.put(
            `http://localhost:3004/api/v1/tasks/${userId}/${taskId}`,
            taskBody
        );
        res.status(200).json({ status: "good", content: taskResponse.data });

    } catch (err) {
        next(err);
    }
}
const deleteTask=async(req,res,next)=>{
    try {

        const userId = String(req.params.userId);
        const taskId= String(req.params.taskId);
        
        const taskResponse = await axios.delete(
            `http://localhost:3004/api/v1/tasks/${userId}/${taskId}`,
        );
        res.status(200).json({ status: "good", content: taskResponse.data });

    } catch (err) {
        next(err);
    }
}


export default {
  createTask,
  deleteTask,
  getAll,
  updateTask,
};
