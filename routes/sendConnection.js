const express = require('express')
const User = require('../models/user')
const mongoose = require('../config/database')
const validation = require('../utils/validation')
var validator = require('validator');
const jwt = require('jsonwebtoken')
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connection');
const connectionRoutes = express.Router()

//to send connection to another user
connectionRoutes.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id.toString()

        const toUserId = req.params.userId
        const status = req.params.status
        const allowedStatus = ["interested", "ignored"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid Status")
        }
        const userId = await User.findById(toUserId)
        if (!userId) {
            throw new Error("User not found")
        }
        console.log("fromUserId", fromUserId)
        console.log("toUserID", toUserId)
        const existingConnection = await ConnectionRequestModel.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnection.length > 0) {
            console.log("existing Connection", existingConnection)
            throw new Error("You have alread sent a connection ")
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({ message: `${req.user.firstName} is ${status} in ${toUserId}`, data: data })
    }
    catch (err) {
        res.status(400).send("Error " + err.message)
    }
})

// to review the request that user has sent
connectionRoutes.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params
        const loggedInUser = req.user._id.toString()
        const allowedStatus = ["accepted", "ignored"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status")
        }
        console.log("requestid", requestId)
        const connectionRequest = await ConnectionRequestModel.findOne({ _id: requestId, fromUserId: loggedInUser, status: "interested" })
        if (!connectionRequest) {
            console.log("connectionRequest", connectionRequest)
            throw new Error("Request not found")
        }
        connectionRequest.status = status
        const response = await connectionRequest.save()
        return res.status(200).json({ message: "Connection Request" + status, data: response })

    }
    catch (err) {
        res.status(400).send("Error " + err.message)
    }
})
module.exports = connectionRoutes