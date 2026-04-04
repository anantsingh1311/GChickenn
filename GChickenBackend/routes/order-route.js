const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../models/order-model");
// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/add", async (req, res) => {
  try {
    const { username, email, address1, address2, city, postcode, items } = req.body;

    if (!username || !email || !address1 || !city || !postcode || !items || items.length === 0) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const cleanedItems = items.map((item) => ({
      itemName: item.itemName,
      price: Number(item.price),
      weight: Number(item.weight)
    }));

    const newOrder = new Order({
      username,
      email,
      address1,
      address2,
      city,
      postcode,
      items: cleanedItems
    });

    await newOrder.save();

    const totalAmount = cleanedItems.reduce(
      (sum, item) => sum + item.price * item.weight,
      0
    );

    const itemLines = cleanedItems
      .map(
        (item) =>
          `${item.itemName} - ${item.weight} kg × ₹${item.price} = ₹${(
            item.weight * item.price
          ).toFixed(2)}`
      )
      .join("\n");

      let emailSent = true;

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // VERY IMPORTANT (must be false for 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  try{

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your GChickenn Order Confirmation",
      text: `Hello ${username},

Thank you for your order with GChickenn.

Order Details:
${itemLines}

Total: ₹${totalAmount.toFixed(2)}

Delivery Address:
${address1}
${address2 ? address2 + "\n" : ""}${city}
${postcode}

We will contact you shortly regarding your order.

Regards,
GChickenn`
    });
  }catch(err){
    emailSent = false;
    console.error("The email recipt could not be sent due to server error, but your order has been saved and our sales representative shall contact you soon!😁");
  }

  if(!emailSent){
     return res.status(201).json({
        success: true,
        emailSent: false,
        message:
          "Order placed successfully, but confirmation email could not be sent. Our team will contact you soon."
      });
  }

// const data = await resend.emails.send({
//   from: process.env.EMAIL_USER,
//   to: email,
//   subject: "Hello World",
//   html: "<p>Congrats on sending your <strong>first email</strong>!</p>"
// });

//  console.log("RESEND RESPONSE:", data);

    res.status(201).json({
      message: "Order placed successfully and confirmation email sent"
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Server error while placing order" });
  }
});
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;