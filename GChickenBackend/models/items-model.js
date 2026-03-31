const mongoose = require("mongoose");

const Schema = mongoose.Schema;



//Data base for items data:
const userSchema = new Schema({
    itemName:{
        type: String,
        required: true,
        trim: true
    },
    description:{
         type: String,
        required: true,
        trim: true,
    },
    price:{
        type: String,
        required: true,
        trim: true
    },
     image:[String]
}, {
    timestamps:true
});

const Items = mongoose.model('Items', userSchema);
module.exports = Items;