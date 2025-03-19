const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token is not valid")
        }
        const decoded = jwt.verify(token, "SECRET@123!")
        const { _id } = decoded
        console.log("id", _id)
        const user = await User.findOne({ _id: _id })
        if (!user) {
            throw new Error("Invalid token")
        }
        req.user = user
        next()
    }
    catch (e) {
        res.status(404).send(e.message)
    }
}
module.exports = auth