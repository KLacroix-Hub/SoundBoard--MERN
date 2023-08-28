const { authJwt } = require("../middlewares");
const controller = require("../controllers/room.controller");

module.exports = function(app) {
  app.use(function(req, res,next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    // res.end();
    next();
  });

  app.post("/api/rooms/create", controller.createRoom);
  app.post("/api/rooms/delete", controller.deleteRoom);
  app.post("/api/rooms/updateRoomName", controller.updateRoomName);
  app.post("/api/rooms/getRoom", controller.getRoom);
  app.post("/api/rooms/getAllRooms", controller.getAllRooms);
  app.post("/api/rooms/deleteRoomFromUser", controller.deleteFromUser);
  app.post("/api/rooms/inviteUser", controller.inviteUser);
  app.post("/api/rooms/kickUser", controller.kickUser);
  app.post("/api/rooms/deleteCutsInRoom", controller.deletecCutsInRoom);
  app.post("/api/rooms/addCutsInRoom", controller.addCutsInRoom);
};