class HomeController {
  renderHome(req, res) {
    // Kiểm tra trạng thái đăng nhập
    const loggedIn = req.isAuthenticated();
    return res.render("home",{loggedIn:loggedIn});
  }
}

module.exports = new HomeController();
