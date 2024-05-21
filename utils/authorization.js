// utils/authorization.js
const jwt = require('jsonwebtoken');


const generateToken = (userId) => {
    const payload = { userId };
    const token = jwt.sign(payload, 'jwt_secret_key', { expiresIn: '1h' });
    return token;
};


const jwtVerifyToken = (req,res,next) => {
    try{
        const token = req.headers["authorization"];
        console.log("jwtVerifyToken", token);
        if(!token) {
            return res.status(401).json({"message":"Unauthorized User"})
        }
        const decoded = jwt.verify(token, 'jwt_secret_key');
        console.log("decoded", decoded);
        //req.key = object
        req.user = decoded.userId; // Assign the user ID to req.user
        // req.user why? and why not - only user variable, 
        // If you just declare a variable user within your jwtVerifyToken function, it will be scoped to that function and won't be accessible to the next middleware or route handlers.
        console.log("req.user", req.user, decoded);
        return next(); //redirect in particular controller() middleware. see routes for better understanding
    } 
    catch(err){
        console.log("Error : ",err);
        return res.status(401).json({"message":err.message})
    }
}

module.exports = {generateToken, jwtVerifyToken};
