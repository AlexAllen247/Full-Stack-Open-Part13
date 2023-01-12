const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");

router.post("/", async (req, res) => {
  const body = req.body;
  const blog = await Blog.findByPk(body.blogId);
  const user = await User.findByPk(body.userId);

  if (!blog)
    return res.status(404).json({ error: "blog with this id was not found" });
  if (!user)
    return res.status(404).json({ error: "user with this id was not found" });

  ReadingList.create(body);
  res.send(body);
});

router.put("/:id", async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  console.log(readingList);

  if (readingList) {
    if (req.decodedToken.id !== readingList.userId) {
      return res
        .status(401)
        .json({ error: "Error: Permission denied" });
    }
    readingList.read = req.body.read;
    await readingList.save();
    return res.json(readingList);
  }
  return res.status(404).json({ error: "Error: No blog found with this id" });
});

module.exports = router;
