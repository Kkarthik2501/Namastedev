const express = require('express')
const authRoutes = express.Router()
const { validation } = require('../utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var validator = require('validator');
const User = require('../models/user')

authRoutes.post("/signup", async (req, res) => {
    try {
        validation(req)
        const { firstName, lastName, emailId, password } = req.body

        const hashpassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashpassword
        }) //creating new instance of user model and then save it
        await user.save({ runValidators: true })
        const token = await user.getJWT()
        res.cookie("token", token)
        return res.status(200).json({ message: "User saved successfully", data: user, success: true })
    }
    catch (err) {
        return res.status(400).json({ error: err.message, success: false })
        // res.status(400).send("Error : " + err.message)

    }
})

authRoutes.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            return res.status(400).json({ error: "Invalid credentials", success: false })
        }
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials", success: false })
        }
        const token = await user.getJWT() //generating a token using helper function defined in schema
        const isValidPassword = await user.verifyPassword(password)
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid credentials", success: false })
        }
        res.cookie("token", token)
        return res.status(200).json({ message: "Successfully logged in", data: user, success: true })
    }
    catch (err) {
        return res.status(400).json({ error: err.message, success: false })
    }
})
authRoutes.get("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })
    return res.status(200).json({ message: "Logged out successfully", success: true })
})
module.exports = authRoutes