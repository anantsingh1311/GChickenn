const express = require("express");
const nodemailer = require("nodemailer");

const Order = require("../models/order-model");
const auth = require("../middleware/authorizationmiddleware");
const adminOnly = require("../middleware/adminmiddleware");

const router = express.Router();

function getEmailConfig() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const rawPassword = process.env.EMAIL_PASS || process.env.EMAI_PASS || "";
  const emailPass = rawPassword.replace(/\s+/g, "").trim();

  return { emailUser, emailPass };
}

function buildOrderText({
  username,
  address1,
  address2,
  city,
  postcode,
  cleanedItems,
  totalAmount
}) {
  const itemLines = cleanedItems
    .map(
      (item) =>
        `${item.itemName} - ${item.weight} kg x Rs.${item.price} = Rs.${(
          item.weight * item.price
        ).toFixed(2)}`
    )
    .join("\n");

  return `Hello ${username},

Thank you for your order with GChickenn.

Order Details:
${itemLines}

Total: Rs.${totalAmount.toFixed(2)}

Delivery Address:
${address1}
${address2 ? `${address2}\n` : ""}${city}
${postcode}

We will contact you shortly regarding your order.

Regards,
GChickenn`;
}

async function sendCustomerConfirmationEmail({
  email,
  username,
  address1,
  address2,
  city,
  postcode,
  cleanedItems,
  totalAmount
}) {
  const { emailUser, emailPass } = getEmailConfig();

  if (!emailUser || !emailPass) {
    console.warn(
      'Customer confirmation email skipped: missing "EMAIL_USER" or "EMAIL_PASS" in backend environment variables.'
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `GChickenn <${emailUser}>`,
      to: email,
      subject: "Your GChickenn Order Confirmation",
      text: buildOrderText({
        username,
        address1,
        address2,
        city,
        postcode,
        cleanedItems,
        totalAmount
      })
    });

    console.log("Customer confirmation email accepted by Gmail SMTP");
  } catch (emailError) {
    console.error("Customer confirmation email failed via Gmail SMTP:", emailError);
  }
}

router.post("/add", auth, async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Our team will contact you soon."
    });

    sendCustomerConfirmationEmail({
      email,
      username,
      address1,
      address2,
      city,
      postcode,
      cleanedItems,
      totalAmount
    }).catch((emailError) => {
      console.error("Unhandled customer confirmation email failure:", emailError);
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while placing order"
    });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
