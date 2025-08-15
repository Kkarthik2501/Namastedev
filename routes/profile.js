const express = require('express')
const User = require('../models/user')
const userAuth = require('../middleware/auth')
const profileRoutes = express.Router()
const { validateEditProfile } = require('../utils/validation')
const bcrypt = require('bcrypt')
profileRoutes.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user

        return res.status(200).json({ data: user, success: true })
    }
    catch (err) {
        return res.status(400).json({ error: "Something went wrong" + err.message, success: false });
    }
})
profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        console.log("req body", req.body)
        const isValid = validateEditProfile(req);
        const LoggedInUser = req.user;
        if (!isValid) {
            throw new Error("Please enter valid fields")
        }
        Object.keys(req.body).forEach((key) => LoggedInUser[key] = req.body[key])
        LoggedInUser.save()
        return res.json({ message: `${LoggedInUser.firstName} your profile has been updated`, data: LoggedInUser, success: true })
    }
    catch (err) {
        return res.status(400).json({ error: "Something went wrong" + err.message, success: false });
    }
})
profileRoutes.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;


        const isValid = await bcrypt.compare(oldPassword, user.password)
        if (!isValid) {
            throw new Error("Please enter valid password")
        }
        user.password = newPassword
        user.save();
        return res.status(200).json({ message: "Password updated successfully", success: true })
    }
    catch (err) {
        return res.status(400).json({ error: "Error : " + err.message, success: false })
    }
}
)
module.exports = profileRoutes