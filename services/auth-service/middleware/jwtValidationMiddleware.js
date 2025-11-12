import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        
        return res.status(403).json({ error: "Missing token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: err });
        }
        req.user = user;
        next();
    });
};


export const checkJwtBelong=(req,res,next)=>{
    if(req.user.userId !== req.params.userId){
            return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
}