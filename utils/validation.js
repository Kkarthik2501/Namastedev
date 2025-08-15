const validate = require('validator')
const validation = (req) => {
    console.log("inside validation")
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("Please enter valid firstname and lastname")
    }
    else if (!validate.isEmail(emailId)) {
        throw new Error("Please enter a valid emailId")
    }
    else if (!validate.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
}
const validateEditProfile = (req) => {
    const allowedEditFields = ["firstName", "lastName", "gender", "emailId", "skills", "age", "about", , "photoURL"]
    const isAllowed = Object.keys(req.body).every((key) => allowedEditFields.includes(key));
    return isAllowed;
}
module.exports = { validation, validateEditProfile }