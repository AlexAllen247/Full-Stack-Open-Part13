const router = require("express").Router();
const Session = require("../models/session");

router.delete("/", async (req, res) => {
  await Session.destroy({
    where: { userId: req.decodedToken.id },
  });
  res.json({ message: `successfully logged out`, userId: req.decodedToken.id });
});

module.exports = router;
