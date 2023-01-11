const router = require("express").Router();

const { Blog, User } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create({
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  });
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (!user) {
    res.status(404).send(`User not found`);
  } else {
    user.username = req.body.username;
    user.updated_at = new Date();
    await user.save();
    res.json({ username: user.username });
  }
});

module.exports = router;
