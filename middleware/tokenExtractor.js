const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
    const currentSession = await Session.findOne({
      where: { userId: req.decodedToken.id, token: authorization.substring(7) },
    });

    if (!currentSession)
      return res.status(401).json({ error: "session expired" });
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = tokenExtractor;
