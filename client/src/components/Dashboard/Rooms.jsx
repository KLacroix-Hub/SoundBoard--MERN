import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigate } from "react-router-dom";

export default function Rooms({socket}) {
    const [roomName,setRoomName] = useState("")
    const [roomToDelete,setRoomToDelete] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))
    const userRooms = user ? [...user.rooms] : null
    var [rooms,setRooms] = useState(userRooms)
    const urlRoomCreate = "http://localhost:8080/api/rooms/create";
    const urlRoomDelete = "http://localhost:8080/api/rooms/delete";
    const headers = {'Content-Type': 'application/json'};
    const [allRooms,setAllRooms] = useState([])
    const [onCreateRoom,setOnCreateRoom] = useState(false)
  
  useEffect(()=>{
    const getRoom = async() => { 
      
      await axios.post(
        "http://localhost:8080/api/rooms/getAllRooms",
        {
            headers:{'Content-Type': 'application/json'}
        }
      )
      .then(res=>setAllRooms(res.data))
      .catch(err=>console.log(err))
    }
    getRoom()
  },[rooms])
  
    //function pour set le nom d'une nouvelle room a partir du formulaire
    const handleRoomName = (e,err) => {
      if(e.target.value !==""){
        setRoomName(e.target.value)
      }
      else{
        return err;
      }
    }
  
    //function de creation de room (axios)
    const handleCreateRoom = async(e) => {
      e.preventDefault() 
      if(roomName !== "" && !rooms.includes(roomName)){
        setRooms(prevRooms=>[...prevRooms,roomName])
        await axios.post(urlRoomCreate, 
          {
            "roomName":roomName.toLowerCase(),
            "admin":user.email
          }, 
          {
            headers:headers,
          })
        .then(res => console.log(res.data))
        .catch(err => console.log( "error", err)
      )
      }
    }
  
    //function de suppression de room (axios)
    const handleDeleteRoom = async(e) => {
      e.preventDefault()
      // Delete a room from db
      await axios.post(urlRoomDelete,
        {
          "roomName":roomToDelete,
          "admin":user.email
        },
        {
          headers:headers
        })
        // set a new array of rooms after deleting from db
        .then(()=>{
          setRooms(current=>current.filter(element =>{
            return element !== roomToDelete
          }))
          console.log(rooms)
        })
        .catch(err => console.log("error",err)
      )
    }

    const handleJoinRoom = (e,user,room) => {
      e.preventDefault()
      socket.emit('join-room', room, user);
      Navigate(`/rooms/${room}`);
    }

  return (
    <section className='dashboard-sub dashboard-sub__rooms'>
        <div className="created-list">
        <ul>
        <h1 className='list-title'>Les rooms que j'ai crées</h1>
          {allRooms.map((room,i)=>
            room.admin === user.email ?
             <div key={i}>
               <form className='card-room' onSubmit={handleDeleteRoom}>
                 <Link onClick={()=>{handleJoinRoom(room._id,user._id)}} className='card-room-no-underline' to={"/rooms/" + room._id}>
                 <div className="card-room__info">
                   <img className='card-room__info-img' src="https://picsum.photos/200/300" alt="" />
                   <p className="card-room__info-name">{room.roomName}</p>
                 </div>
                 </Link>
                 <div className="card-room__users">{room.users.length + 1}
                 <button className='button-delete' onClick={()=>{setRoomToDelete(room.roomName)}}>x</button>
                 </div>
               </form>
              </div>
            : null
            )}
        </ul>
        <form className='card-room card-room__add' action="" onSubmit={handleCreateRoom}>
         {!onCreateRoom && <button onClick={()=>{setOnCreateRoom(!onCreateRoom)}} className='card-room__add-button'>+</button>}
          {onCreateRoom && 
          <div className='card-room__add-input'>
          <input type="text" placeholder='room name' onChange={handleRoomName}/>
          <button>+</button>
          </div>
          }
        </form>
      </div>
     
     <ul className="join-list">
     <h1 className='list-title'>Les rooms ou je suis invité</h1>
       {allRooms.map((aRoom)=>{
         for(let i=0; i < aRoom.users.length; i++){
           let usersJoined = [aRoom.users[i].email]
           if(usersJoined.includes(user.email)){
         return <Link onClick={()=>{handleJoinRoom(aRoom._id,user._id)}} className='card-room' to={"/rooms/" + aRoom._id} key={i}>
                 <div className="card-room__info">
                   <img className='card-room__info-img' src="https://picsum.photos/200/300" alt="" />
                   <p className="card-room__info-name">{aRoom.roomName}</p>
                 </div>
                 <span className="card-room__users">{aRoom.users.length + 1}</span>
             </Link>
           }
         }
       })}
     </ul>
     </section>
  )
}
