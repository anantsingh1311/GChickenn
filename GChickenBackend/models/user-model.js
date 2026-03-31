const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//for password setup
const bcrypt = require("bcryptjs");

//Data base for user data:
const userSchema = new Schema({
   username: {
  type: String,
  required: true,
  unique: true
    },
    firstname:{
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 2
    },
      lastname:{
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 2
    },
    firmname:{
        type: String,
        required: false,
        unique: false,
        trim: true,
        minlength: 2
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:10
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        select: false


    },
    role:{
        type:String,
        default:"customer"
    },
    resetPasswordToken: {
  type: String
},
resetPasswordExpire: {
  type: Date
}
}, {
    timestamps:true
});

userSchema.pre("save", async function(){

//     Prevents rehashing the password every time the user document is updated.
// Without this, even updating something like email would re-hash an already-hashed password and break login.
    if(!this.isModified("password")) return;
    
// Generates a salt for hashing.
// 10 is the cost factor (rounds).
// Higher = more secure but slower.
// 10–12 is standard for production.
//Salt protects against:
// Rainbow table attacks
// Identical passwords producing identical hashes
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;