const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", (req, res) => {
  const { language } = req.query;
  User.findMany({ filters: { language } })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    });
});

usersRouter.get("/:id", (req, res) => {
  User.findOne(req.params.id)
    .then((user) => {
      if (user) res.json(user);
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving user from database");
    });
});

usersRouter.post("/:password", async (req, res) => {
  const { email } = req.body;
  const { password } = req.params;
  console.log("password b4", password);
  let validationErrors = null;
  try {
    const duplicateEmail = await User.findByEmail(email);
    if (duplicateEmail) return await Promise.reject("DUPLICATE_EMAIL");

    if (password.length <= 8) await Promise.reject("PASSWORD_TOO_SHORT");

    const hashedPass = await User.hashPassword(password);
    console.log("hashed pass", hashedPass);

    const updatedUser = { ...req.body, hashedPassword: hashedPass };
    console.log("updated user", updatedUser);
    validationErrors = User.validate(updatedUser);

    if (validationErrors) return await Promise.reject("INVALID_DATA");

    const newUser = await User.create(updatedUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err === "DUPLICATE_EMAIL") {
      res.status(409).json({ message: "This email is already used" });
    } else if (err === "INVALID_DATA") {
      res.status(422).json({ validationErrors });
    } else if (err === "PASSWORD_TOO_SHORT") {
      res.status(400).send("Password must be atleast 8 characters");
    } else {
      res.status(500).send("Error saving the user");
    }
  }
});

usersRouter.put("/:id", (req, res) => {
  let existingUser = null;
  let validationErrors = null;
  console.log(req.params.id);
  Promise.all([
    User.findOne(req.params.id),
    User.findByEmailWithDifferentId(req.body.email, req.params.id),
  ])
    .then(([user, otherUserWithEmail]) => {
      existingUser = user;
      if (!existingUser) return Promise.reject("RECORD_NOT_FOUND");
      if (otherUserWithEmail) return Promise.reject("DUPLICATE_EMAIL");
      validationErrors = User.validate(req.body, false);
      if (validationErrors) return Promise.reject("INVALID_DATA");
      return User.update(req.params.id, req.body);
    })
    .then(() => {
      res.status(200).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`User with id ${userId} not found.`);
      if (err === "DUPLICATE_EMAIL")
        res.status(409).json({ message: "This email is already used" });
      else if (err === "INVALID_DATA")
        res.status(422).json({ validationErrors });
      else res.status(500).send("Error updating a user");
    });
});

usersRouter.delete("/:id", (req, res) => {
  User.destroy(req.params.id)
    .then((deleted) => {
      if (deleted) res.status(200).send("🎉 User deleted!");
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a user");
    });
});

module.exports = usersRouter;
