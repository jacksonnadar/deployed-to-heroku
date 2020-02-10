const moment = require("moment");

const logger = (req, res, next) => {
  try {
    console.log(
      `${req.protocol}, ${req.get("host")}, ${
        req.originalUrl
      }, ${moment().format()}`
    );
    next();
  } catch (err) {
    throw err;
  }
};

module.exports = logger;
