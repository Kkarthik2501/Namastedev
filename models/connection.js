const mongoose = require('mongoose')
const Schema = mongoose.Schema
const connection = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" // user as reference
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        validate(value) {
            if (!["ignore", "accepted", "rejected", "interested"].includes(value)) {
                throw new Error("Invalid status")
            }
        }
    },


}, { timestamps: true })
connection.index({ fromUserId: 1, toUserId: 1 }) // makes sure that the combination of fromUserId and toUserId queries run faster
connection.pre("save", function (next) {
    const Connection = this
    if (Connection.fromUserId.equals(Connection.toUserId)) {
        throw new Error("You cannot send request to yourself")
    }
    next()
}

)
const ConnectionRequestModel = mongoose.model('Connection', connection)
module.exports = ConnectionRequestModel