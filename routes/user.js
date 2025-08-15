const express = require('express')
const userAuth = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connection')
const User = require('../models/user')
const userRouter = express.Router()

//to view the requests that user has received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user
        console.log("logged in user id", loggedInUser)
        const connectionRequest = await ConnectionRequestModel.find({ toUserId: loggedInUser, status: "interested" }).populate("fromUserId")
        if (!connectionRequest) {
            throw new Error("No requests found")
        }
        console.log("Connections I rceived", connectionRequest)
        res.status(200).json({ message: "Connection Requests", data: connectionRequest, success: true })

    }
    catch (err) {
        res.status(400).json({ error: err.message, success: false });
    }
})
//to view the requests that user has accepted and the requests that user has sent which were accepted
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id.toString()
        const connectionRequest = await ConnectionRequestModel.find({ $or: [{ fromUserId: loggedInUser, status: "accepted" }, { toUserId: loggedInUser, status: "accepted" }] }).populate(["fromUserId", "toUserId"])
        console.log("Connections", connectionRequest)
        if (!connectionRequest) {
            res.send("No requests found")
        }
        // const data = connectionRequest.map((req) => req.fromUserId._id.toString()===loggedInUser? req.toUserId : req.fromUserId).filter((req) => req._id.toString() !== loggedInUser)
        const data = connectionRequest.map((req) => req.fromUserId._id.toString() === loggedInUser ? req.toUserId : req.fromUserId)
        //const data = connectionRequest.map((req) => { req.fromUserId._id.toString() != loggedInUser ? req.fromUserId : req.toUserId })
        res.status(200).json({ data: data, success: true })
    }
    catch (err) {
        res.status(400).json({ error: err.message, success: false })
    }
})
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id.toString();
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Fetch connections where the logged-in user is involved
        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser },
                { toUserId: loggedInUser }
            ]
        }).select('fromUserId toUserId');

        // Create a Set of user IDs to hide from feed
        const hideFromFeed = new Set([loggedInUser]);
        connections.forEach((conn) => {
            hideFromFeed.add(conn.fromUserId.toString());
            hideFromFeed.add(conn.toUserId.toString());
        });

        // Find users NOT in the connection set and not the logged-in user
        const users = await User.find({
            _id: { $nin: Array.from(hideFromFeed) }
        })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ users: users, success: true });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }

})
module.exports = userRouter