const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    const emp = this;

    if (!emp.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(emp.password, salt);
        emp.password = hashPass;
        next();
    } catch(err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(givenPassword) {
    try {
        const isMatch = await bcrypt.compare(givenPassword, this.password);
        console.log(isMatch);
        return isMatch;
    } catch(err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;