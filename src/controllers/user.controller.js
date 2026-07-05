const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {
   const { username, email, password, role='user' } = req.body

    const isUserAlreadyExistes = await User.findOne({
        $or: [
            {username},
            {email},
        ]
    })

    if (isUserAlreadyExistes) {
        return res.status(409).json({
            message: "User already Existed"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await User.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    })

    res.cookie("token",token)

    res.status(200).json({
        message: "user registered successfully",
        user
    })
}

async function loginUser(req,res) {
    const {username, email, password} = req.body

    const user = await User.findOne({
        $or: [
            {username},
            {email},
        ]
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalide credentials"
        })
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password)

    if (!isPasswordvalid) {
        res.status(401).json({
            message: "password is Invalid"
        })
    }

    const token = jwt.sign({
        id: user._id
    },process.env.JWT_SECRET)

    res.cookie("Token",token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

module.exports = { registerUser, loginUser }