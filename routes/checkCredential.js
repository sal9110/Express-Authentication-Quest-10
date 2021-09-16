const User = require("../models/user");
const router = require("express").Router();
const connection = require("../db-config");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const db = connection.promise();

  try {
    const [user] = await db.query(
      "SELECT email, hashedPassword FROM users WHERE email = ?",
      [email]
    );

    if (!user.length) await Promise.reject("EMAIL_NOT_FOUND");

    const isPassMatching = await User.verifyPassword(
      password,
      user[0].hashedPassword
    );

    if (!isPassMatching) await Promise.reject("WRONG_CREDENTIALS");

    res.status(200).send("Logged-in succesfully");
  } catch (error) {
    error === "WRONG_CREDENTIALS"
      ? res.status(401).send("Wrong credentials")
      : error === "EMAIL_NOT_FOUND"
      ? res.status(404).send("Email provided not found")
      : res.status(500).send("sorry something went wrong");
  }
});

module.exports = router;
