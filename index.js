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
app.use(express.json())
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

        res.send(users)
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId

        const data = req.body;
        const ALLOWED_UPDATES = ["age", "skills", "firstName", "lastName", "password", "about", "photoURL"] //restricting updation only on some fields
        const isAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isAllowed) {
            return res.status(400).send("Cannot update some fields")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true
        })
        res.send("User Updated Successfully")
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



