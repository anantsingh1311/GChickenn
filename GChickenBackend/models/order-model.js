const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    address1: {
      type: String,
      required: true,
      trim: true
    },
    address2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postcode: {
      type: String,
      required: true,
      trim: true
    },
    items: [
      {
        itemName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        weight: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;