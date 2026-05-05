// The route we are creating:
const router = require('express').Router();
let User = require('../models/user-model');
const auth = require("../middleware/authorizationmiddleware");
const adminOnly = require("../middleware/adminmiddleware");

//API call to get current data from the database:
router.route('/').get(auth, adminOnly, async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.post('/add', async (req, res) => {
  try {
    const {
      username,
      firstname,
      lastname,
      firmname,
      mobile,
      email,
      password
    } = req.body;

    // ------------------------
    // VALIDATION
    // ------------------------

    const usernameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username must include letters and numbers"
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars with uppercase, lowercase, number & special character"
      });
    }

    // ------------------------
    // UNIQUE USERNAME CHECK
    // ------------------------

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // ------------------------
    // CREATE USER
    // ------------------------

    const newUser = new User({
      username,
      firstname,
      lastname,
      firmname,
      mobile,
      email,
      password
    });

    await newUser.save();

    res.json({ message: "User created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//To allow admin to delete user info
router.route('/:id').delete(auth, adminOnly, (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(() => res.json('Excercise data deleted!'))
    .catch(err=> res.status(400).json('Error: '+err))
});
module.exports = router;
