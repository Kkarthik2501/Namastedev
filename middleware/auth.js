const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({ error: "Token is not valid", success: false })
        }
        const decoded = jwt.verify(token, "SECRET@123!")
        const { _id } = decoded
        console.log("id", _id)
        const user = await User.findOne({ _id: _id })
        if (!user) {
            return res.status(401).json({ error: "Token is not valid", success: false })
        }
        req.user = user
        next()
    }
    catch (e) {
        return res.status(404).send(e.message)
    }
}
module.exports = auth