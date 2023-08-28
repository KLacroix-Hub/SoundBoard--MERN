const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

require('dotenv').config();
const http = require("http");
const io = require("socket.io");

const app = express();
const db = require('./models');
const { createIndexes } = require("./models/user.model");
const server = http.createServer(app);
const socketio = io(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Socket.IO
socketio.on('connection', socket => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit("user-connected", userId)
  })

  socket.on("share-cut", async(cut, receiverId) => {
    try{
       const youtubeUrl = cut.videoUrl;
       const title = cut.cutName
       const duration = cut.cutStart - cut.cutEnd
  
       const cutPackage = {
          cut,
          title,
          duration,
          senderId: localStorage.getItem("user").id
       }
  
       socketio.on(receiverId).emit("receive-cut", cutPackage)
      } 
      catch (err) {
        console.error(err)
      }
  })

});


db.mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@soundboard.kslu06s.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

const Role = db.role;

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: process.env.COOKIE_SECRET, // should use as secret environment variable
    httpOnly: true
  })
);

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/room.routes')(app);

// set port, listen for requests
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to soundboard application." });
});

// set port, listen for requests
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
server.listen(3002, () => {
  console.log('Serveur démarré sur le port 3001');
});