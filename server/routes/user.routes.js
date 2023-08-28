const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/users/GetAUser", controller.userBoard);
  app.post("/api/users/getAllPlaylists", controller.getAllPlaylists);
  app.post("/api/users/createPlaylist", controller.createPlaylist);
  app.post("/api/users/deletePlaylist", controller.deletePlaylist);

  app.post("/api/users/getAllCuts", controller.getAllCuts);
  app.post("/api/users/createCut", controller.createCut);
  app.post("/api/users/deleteCut", controller.deleteCut);
};