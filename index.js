const express = require('express')
const app = express()
const User = require('./models/user')
const mongoose = require('./config/database')
const validation = require('./utils/validation')
var validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const userAuth = require('./middleware/auth')
const cors = require('cors')
app.use(cors({
    origin: "http://localhost:5173", // whitelisting the api , only this origin can access the api and cookie will be set in cookie in broswer
    credentials: true
})) // to allow different origin(Ip address) to access the server
app.use(express.json()) // converts the incoming data which is in form of json to js object
app.use(cookieparser())
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const connectionRoutes = require('./routes/sendConnection')
const userRouter = require('./routes/user')
app.use("/", authRoutes)
app.use("/", profileRoutes)
app.use("/", connectionRoutes)
app.use("/", userRouter)

app.get("/feed", async (req, res) => {
    try {
        const { token } = req.cookies
        const decoded = jwt.verify(token, "SECRET@123!")
        console.log("cookie", decoded)
        const users = await User.find({})

        res.status(200).json({ data: users, success: true })
    }
    catch (err) {
        res.status(400).json({ error: "Something went wrong", success: false });
    }
})

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId

        const data = req.body;
        const ALLOWED_UPDATES = ["age", "skills", "firstName", "lastName", "password", "about", "photoURL"] //restricting updation only on some fields
        const isAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isAllowed) {
            return res.status(400).json({ error: "Cannot update some fields", success: false })
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true
        })
        res.status(200).json({ message: "User Updated Successfully" })
    }
    catch (err) {
        res.send("Something went wrong")
    }
})
mongoose().then(() => {
    console.log('Connected!');
    app.listen(4000, () => {
        console.log("Server started.....")
    })
});



