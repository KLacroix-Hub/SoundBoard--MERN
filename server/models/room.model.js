const mongoose = require("mongoose");

const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    roomName: String,
    admin: String,
    users: Array,
    cuts:[
      {
        videoUrl: String,
        cutName: String,
        cutStart:Number,
        cutEnd: Number,
      }
    ],
  })
);

module.exports = Room;