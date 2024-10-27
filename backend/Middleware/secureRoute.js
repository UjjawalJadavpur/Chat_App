import jwt from 'jsonwebtoken'
import User from "../Models/userModel.js"


const secureRoute = async (req, res, next) => {
    
    try{
        const token = req.cookies.jwt;
     //   console.log("secureRoute.js --- TRY Block -- Token :- ", token);
        if(!token) {
            return res.status(401).json({ error: "No token, Authorization denied "});
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if(!decoded || !decoded.userId){
            return res.status(401).json({error: "Invalid Token"})       }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({ error: "No User Found"});
        }
        req.user = user;
        console.log("Authenticated User:", user);
        next();
    } 
    catch(error) {
        console.log("Error in Securing Token :- ",error,error.name);
    }
}

export default secureRoute;