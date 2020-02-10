module.exports = async (req, res, next) => {
  try {
    if (!req.session.session_veryficatied) {
      return res.redirect("/api/users/login");
    }
    next();
  } catch (err) {
    res.status(400).redirect("/api/users/login");
  }
};
