

const { type } = require('express/lib/response')
const mongoose = require('mongoose')
var validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        default: "N/A"

    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid emailId")
            }
        }

    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 50
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Gender is not allowed")
            }
        }
    },
    about: {
        default: "N/A",
        type: String
    },
    photoURL: {
        type: "String",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Please enter a valid URL")
            }
        },
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYgKjNN37Qwt0ySgjA1zQpULg9wfVVuziNFAN6oTvgpvqJwY_y0uHXOnO36OZdcigwRk&usqp=CAU"

    },
    skills: {
        type: [String],
        validate(value) { //validating array to avoid duplicates  
            if (!(Array.isArray(value) && new Set(value).size === value.length)) {
                throw new Error("skills must not contain duplicates")
            }
        }

    },


}, { timestamps: true })

//helper methods
userSchema.methods.getJWT = async function () {
    const user = this // refers to the current user logged in
    const token = jwt.sign({ _id: user._id }, "SECRET@123!", { expiresIn: '1d' })
    return token
}
userSchema.methods.verifyPassword = async function (password) {
    const user = this
    const hashpassword = user.password
    console.log("hashpassword", hashpassword)
    const isValidPassword = await bcrypt.compare(password, hashpassword)
    console.log("isValid", isValidPassword)
    return isValidPassword
}
const User = mongoose.model("User", userSchema);
module.exports = User