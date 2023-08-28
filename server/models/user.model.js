const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    rooms:[
      {
        roomName: String,
      }
    ],
    libraries:{
        cuts:[
          {
            videoUrl: String,
            cutName: String,
            cutStart:Number,
            cutEnd: Number,

              playlists:[
                {
                  _id:Number,
                  playlistName: String,
                }
              ]
          }
        ],

        playlists:[
          {
            _id:Number,
            playlistName: String,
            rooms:[
              {
                _id:Number,
                roomName: String,
              }
            ]
          }
        ]
    }
  })
);

module.exports = User;