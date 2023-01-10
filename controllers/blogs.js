const router = require("express").Router();
const { Blog, User } = require("../models");
const { tokenExtractor } = require("../middleware/tokenExtractor");
const { Op } = require("sequelize");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search,
        },
      },
      {
        author: {
          [Op.substring]: req.query.search,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.decodedToken) {
      throw new Error("You need to be logged to post a blog");
    }
    const user = await User.findByPk(req.decodedToken.id);
    console.log(user);
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
      likes: 0,
    });
    console.log(blog);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  const blog = await req.blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!blog) {
    res.status(404).send("Blog not found!");
  } else {
    res.status(204).send("Blog deleted").end();
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
