const jwt = require("jsonwebtoken");
const Music = require("../models/music.model");

async function createModel(req,res) {
    const token = req.cookie.token

    if(!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET)
}