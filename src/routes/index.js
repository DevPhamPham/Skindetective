const predictRoute = require("./main/predict.route");
// const newsRoute = require("./main/news.route");
// const historyRoute = require("./main/history.route");
const profileRoute = require("./main/profile.route");
const uploadRoute = require("./main/upload.route");
const homeRoute = require("./main/home.route");
const authRoute = require("./auth/auth.route");
const connect = require("../config/db/index");

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  return next();
};



const router = (app) => {
  //connect Mongo
  connect.connect();

  app.use(/^\/(home)?$/, isAuthenticated, homeRoute);
  app.use("/auth", authRoute);


  //predict page
  app.use("/predict", predictRoute);

  //upload page
  app.use("/upload", uploadRoute);

  // // news page
  // app.use("/news", newsRoute);

  // // history page
  // app.use("/history", historyRoute);

  // profile page
  app.use("/profile", profileRoute);
};

module.exports = router;
