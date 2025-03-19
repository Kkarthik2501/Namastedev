const express = require('express')
const userAuth = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connection')
const User = require('../models/user')
const userRouter = express.Router()

//to view the requests that user has received
userRouter.get("/user/requests/received", async (req, res) => {

    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequestModel.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", ["fristName", "lastName"])
        if (!connectionRequest) {
            throw new Error("No requests found")
        }
        res.json({ message: "Connection Requests", data: connectionRequest })

    }
    catch (err) {
        res.status(400).send("Error " + err.message)
    }
})
//to view the requests that user has accepted and the requests that user has sent which were accepted
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id.toString()
        const connectionRequest = await ConnectionRequestModel.find({ $or: [{ fromUserId: loggedInUser, status: "accepted" }, { toUserId: loggedInUser, status: "accepted" }] }).populate("fromUserId")
        if (!connectionRequest) {
            res.send("No requests found")
        }
        const data = connectionRequest.map((req) => req.fromUserId)
        res.status(200).json({ data: data })
    }
    catch (err) {
        res.status(400).send("Error " + err.message)
    }
})
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id.toString()
        let users = await User.find({}).toArray()
        users = users.filter((user) => user._id.toString() !== loggedInUser)
        const connections = await ConnectionRequestModel.find({ $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }] }).projection({ toUserId: 1, fromUserId: 1 }).toArray()
        console.log("connections", connections)
        const hideFromFeed = new Set()
        connections.map((conn) => { hideFromFeed.add(conn.fromUserId.toString()); hideFromFeed.add(conn.toUserId.toString()) })
        users = users.filter((user) => !hideFromFeed.has(user._id.toString())) // use $nin and $ne and operator

        res.send(users)
    }
    catch (err) {
        return res.status(400).send("Error " + err.message)
    }
})
module.exports = userRouter