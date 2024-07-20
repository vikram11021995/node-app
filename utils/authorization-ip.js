// utils/authorization.js
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

// //in case we dont need IP Address
// const generateToken = (userId, userRole) => {
//     const payload = { userId, userRole };
//     const token = jwt.sign(payload, 'jwt_secret_key', { expiresIn: '8h' });
//     return token;
// };


// //in case we dont need IP Address
// const jwtVerifyToken = (req,res,next) => {
//     try{
//         const token = req.headers["authorization"];
//         console.log("jwtVerifyToken", token);
//         if(!token) {
//             return res.status(401).json({"message":"Unauthorized User"})
//         }
//         const decoded = jwt.verify(token, 'jwt_secret_key');
//         // console.log("decoded", decoded);
//         //req.key = object
//         // req.user = decoded.userId; // Assign the user ID to req.user
//         req.user = decoded
//         // req.user why? and why not - only user variable, 
//         // If you just declare a variable user within your jwtVerifyToken function, it will be scoped to that function and won't be accessible to the next middleware or route handlers.
//         // console.log("req.user", req.user, decoded);
//         return next(); //redirect in particular controller() middleware. see routes for better understanding
//     } 
//     catch(err){
//         console.log("Error : ",err);
//         return res.status(401).json({"message":err.message})
//     }
// }




// in case we  also need IP Address and token for authorisation
const generateToken = async (userId, userRole, ipAddress) => {
    const payload = { userId, userRole };
    const token = jwt.sign(payload, 'jwt_secret_key', { expiresIn: '8h' });

    // Store the token and IP address in the database
    const tokenDoc = new Token({
        token,
        userId,
        ipAddress,
        expiryTime: Date.now()+(8*60*60*1000)
    });

    await tokenDoc.save();

    return token;
};


const jwtVerifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        const ipAddress = req.ip;

        console.log("jwtVerifyToken", token);
        console.log("ipAddress", ipAddress);

        if (!token) {
            return res.status(401).json({ "message": "Unauthorized User" });
        }

        const decoded = jwt.verify(token, 'jwt_secret_key');

        // Find the token in the database and check the IP address
        const storedToken = await Token.findOne({ token });
        console.log("storedToken: ", storedToken);

        if (!storedToken) {
            return res.status(401).json({ "message": "Invalid token" });
        }

        req.user = decoded;
        console.log("decoded: ", decoded);
        return next();
    } catch (err) {
        console.log("Error : ", err);
        return res.status(401).json({ "message": err.message });
    }
};



//extra code. so commented. NO Need but just for understanding purpose.so its commented
// const checkRole = (allowedRole) =>{
//     try{
//         const {userRole} = req.user;
//         if(userRole==allowedRole) return next();
//         return res.status(401).json({"message":"Required Admin Access"})
//     } 
//     catch(err){
//         console.log("Error : ",err);
//         return res.status(401).json({"message":err.message})
//     }
// }

const checkUserRole = (allowedRoles) => (req, res, next) => {
    try {
        const { userRole } = req.user;
        //allowedRoles- array of roles, userRole- user's actual role fetched from user details decoded from auth token
        //Ex: allowedRoles=["admin","vendor"], userRole="vendor"
        //Here allowedRoles is an array of string whereas userRole is a string. 
        //So we can not directly compare them using "==" operator
        //So to check if userRole is present in allowedRoles, we have used array.includes() method as given below.
        //["admin","vendor"].includes("vendor") ==output==> true
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ "message": "Unauthorized Access" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

module.exports = {generateToken, jwtVerifyToken, checkUserRole};
