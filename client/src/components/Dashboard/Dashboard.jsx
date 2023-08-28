import axios from 'axios';
import React, { useState } from 'react'
import {useNavigate, Navigate } from 'react-router-dom';
import "./Dashboard.scss"
import Library from './Library';
import ProfilSection from './ProfilSection';
import Rooms from './Rooms';


export default function Dashboard({socket}) {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const [roomSection, setRoomSection] = useState(true)
  const [librarySection, setLibrarySection] = useState(false)
  const [profilSection, setProfilSection] = useState(false)

  //function de deconnexion du user (axios)
  const handleSubmit = async(e) => {
    await axios.post(
      "http://localhost:8080/api/auth/signout",
      {
        "_id":user.id,
        "email": user.email
      }
    )
    .then(res=>console.log(res.data))
    .then(() => {
        localStorage.removeItem("user")
        if(user===null){
          return navigate("/")
        }
    })
    .catch(err=>console.log("error",err))

    if(localStorage.getItem('user') === null){
      return navigate("/")
    }
  }

  const handleRoomSection = () => {
    setRoomSection(true)
    setLibrarySection(false)
    setProfilSection(false)
  }

  const handleLibrarySection = () => {
    setRoomSection(false)
    setLibrarySection(true)
    setProfilSection(false)
  }

  const handleProfilSection = () => {
    setRoomSection(false)
    setLibrarySection(false)
    setProfilSection(true)
  }

  if(user === null){
    return <Navigate to="/" replace={true} />
  }

  return (
  <>
    <div className="dashboard">
      <img src='/background.png' className="dashboard-background" alt=""/>
        <div className="userName">
          {user.email}
        </div>
      <section className="dashboard-content">
      <ul className="dashboard-content__navigation">
          <li onClick={handleRoomSection} className={roomSection ? "menu-item active" : "menu-item"}>Les rooms</li>
          <li onClick={handleLibrarySection} className={librarySection ? "menu-item active" : "menu-item"}>Ma librairie</li>
          <li onClick={handleProfilSection} className={profilSection ? "menu-item active" : "menu-item"}>Mon profil</li>
          <button className='menu-item menu-item__logout' onClick={handleSubmit}>Déconnexion</button>
      </ul>
        {roomSection && <Rooms />}
        {librarySection && <Library />}
        {profilSection && <ProfilSection />}
      </section>
    </div>
</>
  )
}
