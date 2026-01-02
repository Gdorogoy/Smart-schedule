import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || authHeader!== 'Baerer'){
        return res.status(401).json({
            status:"bad",
            message:"Token required"
        });
    }
    const token = authHeader && authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        req.user = user;
        next();
    });
    }catch(err){
        console.log(err);
        if(err.name==="TokenExpiredError"){
            return res.status(403).json({
                status: "bad",
                content: "Token expired"
            });
        }
        else{
            return res.status(401).json({
                status:"bad",
                content:"Token expired"
            });
        }
    }

};


export const checkJwtBelong=(req,res,next)=>{
    if(req.user.userId !== req.params.userId){
            return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
}