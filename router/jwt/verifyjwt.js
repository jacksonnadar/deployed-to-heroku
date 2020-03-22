const jwt = require("jsonwebtoken");
const JwtToken = require("../../api/models/jwttoken");

module.exports = async (req, res, next) => {
  try {
    const result = await JwtToken.findById(req.params.id);

    if (!result) {
      return res.status(401).redirect("/api/users/login");
    }

    const varified = jwt.verify(result.token, process.env.TOKEN_SECRET);
    // req.user = varified;
    // console.log(req.user);

    req.session.user_name = result.name;

    next();
  } catch (err) {
    res.status(400).redirect("/api/users/login");
  }
};
