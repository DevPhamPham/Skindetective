const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth");
    }
    return next();
  };

module.exports = isAuthenticated;