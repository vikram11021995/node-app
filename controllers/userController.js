const User = require('../models/User');
const Message = require('../models/Message');

const {generateToken} = require('../utils/authorization');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    console.log("====> Inside signup()")
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        console.log("Hashed pwd : ",hashedPwd);
        user = new User({ username, password: hashedPwd });
        await user.save();
        const token = generateToken(user.id);
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
        console.log("isMatch : ",isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password credentials' });
        }
        console.log("before ------>token");

        const token = generateToken(user.id);
        console.log("after ------>token");
        res.status(200).json({ token });

        // const payload = { userId: user.id };
        // const token = jwt.sign(payload, 'jwt_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.log("error : ",error)
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUsers = async (req, res) => {
    try{
      let users = await User.find({});
      res.status(200).json(users)
  
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

