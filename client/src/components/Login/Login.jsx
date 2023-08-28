import axios from 'axios';
import React, { useState as s } from 'react'
import { Navigate, redirect } from 'react-router-dom';
import './login.scss'

export default function Login({socket}) {
  const [email, setEmail] = s("")
  const [password, setPassword] = s("")
  const [isAuth, setIsAuth] = s(false)
  const [userFound, setUserFound] = s(false)
  const burl = "http://localhost:8080/api/auth/signin";


  const handleLogin = (e) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const headers = {
      'Content-Type': 'application/json',
    }
    
    const user = JSON.stringify({
      "email": email,
      "password": password
    })

    await axios.post(`${burl}`, user, {
      headers:headers,
    })
    .then( res => {
      if(res.data.status === 404){
        
        console.log(userFound)
      }

      else if (res.data.accessToken){
        localStorage.setItem("user", JSON.stringify(res.data))
        setIsAuth(!isAuth)
        redirect("/dashboard")
      }

      return res.data 
    })
    .catch(err => {
      console.log("l'erreur ?", err)
      if(err.response.status === 404){
        setUserFound(true)
      }
    })
  }

  if(localStorage.getItem("user") !== null){
    return <Navigate to="/dashboard" replace={true} />
  }
    return (
    <div className="login">
      <section className='login-content'>
        <h1 className='logo'>Soundboard</h1>
        <form className='login-content__form' onSubmit={handleSubmit}>
          <h2 className='login-content__form-title'>Login</h2>
          <div className="inputs-form">
            <input type="text" placeholder='Login' onChange={handleLogin}></input>
            <input type="password" placeholder='Mot de passe' onChange={handlePassword}></input>
            <br />
            {userFound === true && 
              <p className='user-not-found'>User not found!</p>
            }
          </div>
          <button className='login-content__form-button'>Me connecter</button>
        </form>
      </section>
      <img className={isAuth ? "login-background login-left" : "login-background"} src="/background.png" alt="" />
      {isAuth &&
        <Navigate to="/dashboard" replace={false}/>
      }
    </div>
  )
}
