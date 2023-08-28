import axios from 'axios'
import React, { useState } from 'react'
import {Navigate} from 'react-router-dom'

export default function SignUp({socket}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roles, setRoles] = useState("")
  const [resStatut, setResStatus] = useState()

  const burl = "http://localhost:8080/api/auth/signup";

  const handleLogin = (e) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleRole = (e) => {
    setRoles(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = JSON.stringify({
      "email": email,
      "password": password,
      "roles": [
        roles
      ]
    })

    const headers = {
      'Content-Type': 'application/json',
    }
    
  await axios.post(burl, user, {
    headers:headers,
  })
    .then(response => setResStatus(response.status))
    .catch(err => console.log( "error", err)); 
  }

  if(localStorage.getItem("user") !== null){
    return <Navigate to="/dashboard" replace={true} />
  }
  
  return (
    <section>
    <form action="" onSubmit={handleSubmit}>
      <input type="text" onChange={handleLogin} placeholder="email"></input>
      <input type="password" onChange={handlePassword} placeholder="mot de passe"></input>
      <input type="text" onChange={handleRole} placeholder="role"></input>

      {resStatut === 400 &&
        <div>Mail ou mot de passe déjà utilisé </div>
      }

      {resStatut === 200 && 
        <Navigate to="/" replace={true}/>
      }

      <button>clique</button>
    </form>
    </section>
  )
}
