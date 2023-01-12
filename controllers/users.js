const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create({
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const where = {
    userId: req.params.id,
  };

  if (req.query.read === "true") {
    where.read = true;
  } else {
    where.read = false;
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          attributes: [],
        },
        include: {
          model: ReadingList,
          where,
          attributes: ["id", "read"],
        },
      },
    ],
  });
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
    user.updatedAt = new Date();
    await user.save();
    res.json({ username: user.username });
  }
});

module.exports = router;
