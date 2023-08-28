import axios from 'axios'
import React, { useEffect,useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./room.scss"
import ButtonActivePlaylist from './ButtonActivePlaylist'
import Cut from '../Dashboard/Cut'

export default function Room({socket}) {
    let {roomId} = useParams()
    const [room,setRoom] = useState({})
    const url = "http://localhost:8080/api/rooms/getRoom"
    const urlAddUser = "http://localhost:8080/api/rooms/inviteUser"
    const [addUser, setAddUser] = useState("")
    const urlKickUser = "http://localhost:8080/api/rooms/kickUser"
    const [deleteUser, setDeleteUser] = useState("")
    const auth = JSON.parse(localStorage.getItem("user"))
    const [user,setUser] = useState({})
    const adminFirstChar = room.admin && room.admin.charAt(0).toUpperCase()

    const [update,setUpdate] = useState(false)
    const [roomUpdate,setRoomUpdate] = useState("")
    const [usersToSend,setUsersToSend] = useState([])

    const [boutonsActifs, setBoutonsActifs] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState([]);

    useEffect(()=>{
        const getProfile = async()=>{
            await axios.post("http://localhost:8080/api/users/GetAUser",
            {
                "email":auth.email
            }
            )
            .then(res=>setUser(res.data.user))
            .catch(err=>console.log(err))
        }
        const getRoom = async()=> { 
            await axios.post(url,
            {
                "_id":roomId
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        )
        .then(res=>setRoom(res.data))
        .catch(err=>console.log(err))
        }
        const getUsersToSend = async()=>{
            setUsersToSend([room.admin,...room.users])
        }

        getProfile()
        getRoom()
        // getUsersToSend()
    },[roomId,auth.email,room.admin,activePlaylist]) 

    const addUserRoom = async() =>{
        await axios.post(urlAddUser,
            {
                "_id":roomId,
                "userName": addUser, 
            }
        )
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err))
    }
    const deleteUserRoom = async()=>{
        await axios.post(urlKickUser,
            {
                "_id":roomId,
                "userName": deleteUser, 
            }
        )
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err))
    }
    const handleChangeUser = (e) =>{
        setAddUser(e.target.value)
    }
    const handleRoomUpdate = (e) =>{
        setRoomUpdate(e.target.value)

    }
    const handleUpdateRoomName = async(e)=>{
        e.preventDefault()
        await axios.post("http://localhost:8080/api/rooms/updateRoomName",
            {
                "_id":roomId,
                "roomNameUpdate":roomUpdate
            }
        )
        .then(res=>console.log(res.data))
        .then(window.location.reload())
        .catch(err=>console.log(err))
    }
    const handleModify = (e) =>{
        setUpdate(!update)
    }
    const handleDeleteRoomFromUser = async(e) =>{
        e.preventDefault();
        await axios.post("http://localhost:8080/api/rooms/deleteRoomFromUser",
            {
                "email":user.email,
                "_id":roomId
            }
        )
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err))
    }
    const handleClick = async(index,playlistName) => {
        if (boutonsActifs.includes(index)) {
            setBoutonsActifs(boutonsActifs.filter((i) => i !== index));
            // console.log(boutonsActifs)
            setActivePlaylist(activePlaylist.filter((i) => i !== index))
            localStorage.setItem("activePlaylist",JSON.stringify(activePlaylist))
            // console.log(localStorage.getItem("activePlaylist"))
            auth.libraries.cuts.map(async(cut)=>{
                cut.playlists.map(async(playlist)=>{
                    if(playlist.playlistName === playlistName){
                        await axios.post("http://localhost:8080/api/rooms/deleteCutsInRoom",
                    {
                        "_id":roomId,
                        "cutId":cut._id
                    }
                    )
                    .then(res=>console.log(res.data))
                    .catch(err=>console.log(err))
                    }
                })
            })
        }
        else {
            setBoutonsActifs([...boutonsActifs, index]);  
            // console.log(boutonsActifs)
            setActivePlaylist([...activePlaylist,index])
            localStorage.setItem("activePlaylist",JSON.stringify(activePlaylist))
            // console.log(localStorage.getItem("activePlaylist"))
            auth.libraries.cuts.map(async(cut)=>{
                cut.playlists.map(async(playlist)=>{
                    if(playlist.playlistName === playlistName){
                        await axios.post("http://localhost:8080/api/rooms/addCutsInRoom",
                    {
                        "_id":roomId,
                        "cut":cut
                    }
                    )
                    .then(res=>console.log(res.data))
                    .catch(err=>console.log(err))
                    }
                })
            })
        }
    }

  return (
    <div className='room'>
        <div className="room-lists">
            <Link className='room-lists__item settings' to={"/rooms/" + roomId + "/update"}><img src="/room-settings.svg" alt="" /></Link>
           {user.rooms && user.rooms.map((allRoom,i)=>
                <Link key={i} className={allRoom._id === roomId ? "room-lists__item active" : "room-lists__item"} to={"/rooms/" + allRoom._id}>{allRoom.roomName.charAt(0).toUpperCase()}</Link>
            )}
            <Link to="/" className='room-lists__add'>+</Link>
        </div>
        <div className='room-infos'>
            <h1 className='logo'>Soundboard</h1>
            {user.email === room.admin 
            ?
                    <div className='roomname-container'>
                        <h2 onClick={handleModify} className='room-infos__name'>{room.roomName}</h2>
                        {user.email === room.admin && update &&
                        <form className='room-infos__update' action="" onSubmit={handleUpdateRoomName}>
                            <input placeholder='nouveau nom de room' type="text" onChange={handleRoomUpdate}/>
                            <button>Modifier</button>
                        </form>
                        }
            </div>
            : 
            <div className='roomname-container'>
                <h2 className='room-infos__name'>{room.roomName}</h2>
            </div>
            }
            
            
            <div className="room-infos__users">
                <h4>Ils ont rejoint la room</h4>
                <div className="room-infos__users-list">
                    <div className="admin">
                        <div className='admin-icon'>{adminFirstChar}</div>
                        <p className='admin-name'>{room.admin}</p>
                    </div>
                    {room.users &&
                        <>
                        {
                            room.users.map((uniqueUser,i)=>
                                <form className='user' key={i} onSubmit={deleteUserRoom}>
                                    <div className='user-icon'>{uniqueUser.email ? uniqueUser.email.charAt(0).toUpperCase() : "Undefined"}</div>
                                    <p className='user-name'>{uniqueUser.email}</p>
                                    {user.email === room.admin && 
                                    <button onClick={()=>setDeleteUser(uniqueUser.email)}>X</button>
                                    }
                                </form>
                            )
                        }
                        </>
                    }
                </div>
                {user.email === room.admin &&
                <form className='room-infos__users-invite' action="" onSubmit={addUserRoom}>
                <>
                <input type="text" onChange={handleChangeUser}/>
                <button>Inviter</button>
                </>
                </form>
                }

                {user.email !== room.admin &&
                <form className='room-infos__users-quit' onSubmit={handleDeleteRoomFromUser} action="">
                <button>Quitter</button>
                </form>
            }
            </div>
        </div>
        <div className="room-cuts">
            <div className="room-cuts__search">
                <input type="text" placeholder='Rechercher un son'/>
            </div>
            <div className="room-cuts__user">
                <h2>Mes playlists personnel</h2>
                {user && 
                    <div className="room-cuts__user-list">
                        {auth.libraries.playlists.map((playlist,index)=>
                            <div key={index} className="room-cuts__user-list-item">
                                <p>{playlist.playlistName}</p>
                                <button
                                    key={index}
                                    className={ "btn-active"}
                                    onClick={() => {
                                        handleClick(index,playlist.playlistName)
                                    }}
                                    
                                >
                                </button>
                                {/* <ButtonActivePlaylist 
                                    actif={ boutonsActifs.includes(index)}
                                    activePlaylist={}
                                    key={index}
                                    onClick={() => {
                                        handleClick(index,playlist.playlistName)
                                    }}
                                /> */}
                            </div>
                        )}
                    </div>
                }
            </div> 
            <div className="room-cuts__history">
                <h2>Historique de réception</h2>
            </div>
            <div className="room-cuts__activated">
                <h2>Les Cuts de la room</h2>
                {room.cuts &&
                    room.cuts.map((roomCut,i)=>
                        <div key={i} className="room-cuts__activated-item">
                            <Cut
                                socket={socket}
                                isRoom={true}
                                index={i}
                                cut={roomCut}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}
