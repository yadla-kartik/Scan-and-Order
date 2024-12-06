const express = require("express");
const User = require("../models/user");
const { generateJWT } = require("../service/authentication");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { fullname, mobileNo, role } = req.body;

    let user = await User.findOne({ mobileNo });

    if (user) {
      const token = generateJWT(user);
      res.cookie("userToken", token);
    } else {
      user = await User.create({
        fullname,
        mobileNo,
        role,
      });
      const token = generateJWT(user);
      res.cookie("userToken", token);
    }

    return res.redirect('/');
  } catch (error) {
    console.error("Error in /login:", error.message);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
