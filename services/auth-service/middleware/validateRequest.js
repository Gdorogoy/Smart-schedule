export const validateReq = async (req, res, next) => {

    const { email, password, firstname} = req.body;

    if (!req.body.email) {
        return res.status(400).json({ status: "bad", error: "Email is required" });
    }
    if (!req.body.password) {
        return res.status(400).json({ status: "bad", error: "Password is required" });
    }
    if (!req.body.firstname) {
        return res.status(400).json({ status: "bad", error: "First name is required" });
    }


    next();
};

export const validateReqLog = async (req, res, next) => {
    const { email, password } = req.body;


    if (!email) {
        return res.status(400).json({ status: "bad", error: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ status: "bad", error: "Password is required" });
    }

    next();
};