const config = require("../config/auth.config");
const { user, room } = require("../models");
const db = require("../models");
const { rawListeners } = require("../models/user.model");
const User = db.user;
const Room = db.room;

exports.createRoom = (req,res) => {

    const room = new Room({
        roomName: req.body.roomName,
    });

    room.save((err,room)=>{
        if(err){
            res.status(500).send({message:err})
            return;
        }

        if(req.body.admin){
            User.findOneAndUpdate(
                {
                    email: req.body.admin
                },
                {
                    $push:{
                        rooms:[
                            {...room}
                        ]
                    }
                },
                (err,admin) => {
                    if(err){
                        res.status(500).send({message:err})
                        return;
                    }

                    room.admin = admin.email

                    room.save((err)=>{
                        if(err){
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({ message: "Room was registered successfully!" });
                    })
                }
            )
        }

        else{
            return err;
        }
    })
}

exports.deleteRoom = (req,res) =>{

    const room = Room.findOne(
        {
            roomName:req.body.roomName
        }
    )
    
    room.deleteOne(
        {
            roomName:req.body.roomName
        },
        (err)=>{
            if(err){
                res.status(500).send({message:"Error"})
                return
            }
            if(req.body.roomName && req.body.admin){
                User.updateMany(
                    {
                        $in:{
                            rooms:{
                                "roomName": req.body.roomName
                            }
                        }
                    },
                    {
                        $pull:{
                            rooms:{
                                    "roomName": req.body.roomName
                            }
                        }
                    },
                    (err)=>{
                        if(err){
                            res.status(500).send({message:"err"})
                            return;
                        }
                        else{
                            res.status(200).send({
                                message:"Room deleted by admin!"
                            })
                        }
                    }
                );
            }
            else{
               return err;
            }
        }
    )

    
}

exports.updateRoomName = async(req,res) => {
    try{
        const room = await Room.findOneAndUpdate(
            {
                _id:req.body._id
            },
            {
                $set:{
                    roomName:req.body.roomNameUpdate
                }
            }
        )
        
        const user = await User.find(
            {
                rooms:{
                    $elemMatch:{
                        _id:req.body._id
                    }
                }
            }
        )
        user.forEach((user)=>{
            user.rooms.forEach((room)=>{
                if(room._id == req.body._id){
                    room.roomName = req.body.roomNameUpdate
                    user.save()
                }
            })
        })

        res.status(200).send("Room Name Updated!")
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

exports.getRoom = (req,res) => {

    Room.findOne(
        {
            _id:req.body._id
        }
    )

    .exec((err,room)=>{
        if(err){
            res.status(500).send({message:err})
        }
        if(!room){
            res.status(500).send({message:"Room not found !"})
        }
        else{
            res.status(200).send({
                id: room._id,
                roomName: room.roomName,
                users: room.users,
                admin:room.admin,
                cuts:room.cuts
            })
        }
    })

}

exports.getAllRooms = async(req,res) => {
    let options = {...req.query}
    try{
        const rooms = await Room.find(options)
        res.status(200).json(rooms)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.inviteUser = (req,res) => {
    Room.findOne(
        {
            _id:req.body._id
        }
    )
    .exec((err,room)=>{
        if(err){
            res.status(500).send({message:err})
            return
        }
        if(!room){
            res.status(500).send({message:"Room not found !"})
            return
        }
        else{
            User.findOneAndUpdate(
                {
                    email:req.body.userName
                },
                {
                    $push:{
                        rooms:[
                            {...room}
                        ]
                    }
                },
                (err,user)=>{
                    if(err){
                        res.status(500).send({message:err})
                        return
                    }
                    if(!user){
                        res.status(500).send({message:"user doesn't exist!"})
                        return
                    }
                    else{
                        room.updateOne(
                            {
                                $push:{
                                    users:
                                        {
                                            _id: user._id,
                                            email: user.email
                                        }
                                }
                            },
                            (err)=>{
                                if(err){
                                    res.status(500).send({message:err})
                                    return
                                }
                            }
                        )
                        res.send({message:"User and Room updated !"})
                    }
                }
            )
        }
    }) 
}

exports.kickUser = (req,res) => {
    Room.findOne(
        {
            roomName:req.body.roomName
        }
    )
    .exec((err,room)=>{
        if(err){
            res.status(500).send({message:err})
            return
        }
        if(!room){
            res.status(500).send({message:"Room not found !"})
            return
        }
        else{
            User.findOneAndUpdate(
                {
                    email:req.body.userName
                },
                {
                    $pull:{
                        rooms:
                            {
                                _id:room._id
                            }
                        
                    }
                },
                (err,user)=>{
                    if(err){
                        res.status(500).send({message:"erreur user"})
                        return
                    }
                    if(!user){
                        res.status(500).send({message:"user doesn't exist!"})
                        return
                    }
                    else{
                        room.updateOne(
                            {
                                $pull:{
                                    users:
                                        {
                                            email:req.body.userName
                                        }
                                    
                                }
                            },
                            (err)=>{
                                if(err){
                                    res.status(500).send({message:"erreur room"})
                                    return
                                }
                            }
                        )
                        res.send({message:"User and Room deleted !"})
                    }
                }
            )
        }
    }) 
}

exports.deleteFromUser = async(req,res) => {
    try{
        const user = await User.findOneAndUpdate(
            {
                email:req.body.email
            },
            {
                $pull:{
                    rooms:{
                        _id:req.body._id
                    }
                }
            }
        )
        const room = await Room.findOneAndUpdate(
            {
                roomName:req.body._id
            },
            {
                $pull:{
                    users:{
                        email:req.body.email
                    }
                }
            }
        )
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.addCutsInRoom = async(req,res) => {
    try{
        const room = await Room.findOneAndUpdate(
            {
                _id:req.body._id
            },
            {
                $push:{
                    cuts:{
                        ...req.body.cut
                    }
                }
            }
        )
        res.status(200).json(room)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.deletecCutsInRoom = async(req,res) => {
    try{
        const room = await Room.findOneAndUpdate(
            {
                _id:req.body._id
            },
            {
                $pull:{
                    cuts:{
                        _id:req.body.cutId
                    }
                }
            }
        )
        res.status(200).json(room)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}