const User = require('../models/User');
const Message = require('../models/Message');
const Token = require("../models/Token");

const {generateToken} = require('../utils/authorization');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    console.log("====> Inside signup()")
    const { username, password, userRole } = req.body;
    
    console.log("req.body", req.body);

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        console.log("Hashed pwd : ",hashedPwd);
        user = new User({ username, password: hashedPwd, userRole });
        await user.save();
        // const token = await generateToken(user.id, user.userRole, req.ip);
        const token = await generateToken(user.id, user.userRole);
        console.log("token: ", token);

        res.status(201).json({ token });
        // const payload = { userId: user.id };
        // const token = jwt.sign(payload, 'jwt_secret_key', { expiresIn: '1h' });
        // res.status(201).json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    console.log("\n====> Inside login()")
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password credentials' });
        }
        // const token = await generateToken(user.id, user.userRole, req.ip);
        const token = await generateToken(user.id, user.userRole);
        console.log("token : ", token);

        // return res.status(200).json({ user,token });
        return res.status(200).json({ token });

    } catch (error) {
        console.log("error : ",error)
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUsers = async (req, res) => {
    try{
      let users = await User.find({});
      let response = {
        "message":"List of Users",
        "users": users
      }
      res.status(200).json(response)
  
    } catch (err) {
      res.status(401).json(err)
    }
  }


exports.createMessage = async (req, res) => {
    const { message } = req.body;
    const createdBy = req.user;
    console.log("--------> create message : ", message, createdBy);
    try {
        const newMessage = new Message({ message, createdBy });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.signout = async (req, res) => {
    console.log("====> Inside signout()")
    try {
        const token = req.headers["authorization"];
        const result = await Token.deleteOne({token});
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};