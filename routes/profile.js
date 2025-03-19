const express = require('express')
const User = require('../models/user')
const userAuth = require('../middleware/auth')
const profileRoutes = express.Router()
const { validateEditProfile } = require('../utils/validation')
const bcrypt = require('bcrypt')
profileRoutes.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user

        res.send(user)
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
})
profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isValid = validateEditProfile(req);
        const LoggedInUser = req.user;
        if (!isValid) {
            throw new Error("Please enter valid fields")
        }
        Object.keys(req.body).forEach((key) => LoggedInUser[key] = req.body[key])
        LoggedInUser.save()
        res.json({ message: `${LoggedInUser.firstName} your profile has been updated`, data: LoggedInUser })
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message);
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
        res.status(200).send("Password updated successfully")
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
}
)
module.exports = profileRoutes