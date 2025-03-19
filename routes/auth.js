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
        res.send("User saved successfully")
    }
    catch (err) {
        res.status(400).send("Error : " + err)
    }
})

authRoutes.get("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid credentials")
        }
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const token = await user.getJWT() //generating a token using helper function defined in schema
        const isValidPassword = user.verifyPassword(password)
        if (!isValidPassword) {
            throw new Error("Invalid credentials")
        }
        res.cookie("token", token)
        res.send("Successfully logged in")
    }
    catch (err) {
        res.status(400).send("Error : " + err)
    }
})
authRoutes.get("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })
    res.send("Logged out successfully")
})
module.exports = authRoutes