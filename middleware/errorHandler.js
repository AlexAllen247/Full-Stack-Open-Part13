const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({
      message: error.message,
    });
  }
  next(error);
};

module.exports = errorHandler;
