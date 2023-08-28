const config = require("../config/auth.config");
const { user, room } = require("../models");
const db = require("../models");
const { rawListeners } = require("../models/user.model");
const User = db.user;

exports.userBoard = async(req, res) => {
  try{
    const user = await User.findOne({email:req.body.email});
    res.status(200).json({ user });
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

exports.createPlaylist = async(req, res) => {
  try{
    const user = await User.findOneAndUpdate(
      {
        email:req.body.email
      },
      {
        $push: {       
          "libraries.playlists": {
            playlistName: req.body.playlistName
          }
        }
      },
    );
    res.status(200).json(user.libraries.playlists);
  }
  
  catch(err){
    res.status(500).json({ message: err.message });
  }

}

exports.getAllPlaylists = async(req, res) => {
  try{
    const user = await User.findOne(
      {
        email:req.body.email
      }
    )
    const playlists = user.libraries.playlists;

    res.status(200).json({ playlists });
  }

  catch{
    res.status(500).json({ message: err.message });
  }
}

exports.deletePlaylist = async(req, res) => {
  try{
  const user = await User.findOneAndUpdate(
    {
      email:req.body.email
    },
    {
      $pull: {       
        "libraries.playlists": {
          playlistName: req.body.playlistName
        }
      }
    },
  );
  res.status(200).json(user.libraries.playlists);
}

catch(err){
  res.status(500).json({ message: err.message });
}
}

exports.getAllCuts = async(req, res) => {
  try{
    const user = await User.findOne(
      {
        email:req.body.email,
      }
      )
      const cuts = user.libraries.cuts;
      res.status(200).json({ cuts });
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

exports.createCut = async(req, res) => {
  try{
    const user = await User.findOneAndUpdate(
      {
        email:req.body.email
      },
      {
        $push: {       
          "libraries.cuts": {
            videoUrl: req.body.videoUrl,
            cutName: req.body.cutName,
            cutStart: req.body.cutStart,
            cutEnd: req.body.cutEnd,
            playlists: [
              {playlistName: req.body.playlistName}
            ]
          }
        },
      }
    )
    
    res.status(200).json(user.libraries.cuts);
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

exports.deleteCut = async(req, res) => {
  try{
    const user = await User.findOneAndUpdate(
      {
        email:req.body.email
      },
      {
        $pull: {       
          "libraries.cuts": {
            cutName: req.body.cutName
          }
        }
      }
    );
    res.status(200).json(user.libraries);
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}