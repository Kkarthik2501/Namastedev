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

        const existingConnection = await ConnectionRequestModel.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnection.length > 0) {
            throw new Error("You have already sent a connection ")
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        return res.json({ message: `${req.user.firstName} is ${status} in ${toUserId}`, data: data, success: true })
    }
    catch (err) {
        return res.status(400).json({ error: err.message, success: false })
    }
})

// to review the request that user has sent
connectionRoutes.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params
        const loggedInUser = req.user._id.toString()
        const allowedStatus = ["accepted", "ignored", "rejected"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status")
        }
        const connectionRequest = await ConnectionRequestModel.findOne({ _id: requestId, toUserId: loggedInUser, status: "interested" })
        if (!connectionRequest) {
            throw new Error("Request not found")
        }
        connectionRequest.status = status
        const response = await connectionRequest.save()
        return res.status(200).json({ message: "Connection Request" + status, data: response, success: true })

    }
    catch (err) {
        return res.status(400).json({ error: err.message, success: false })
    }
})
module.exports = connectionRoutes