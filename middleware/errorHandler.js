const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  return res.status(400).send("Unfortunately something went wrong. No worries you can fix it!");
};

module.exports = errorHandler;
