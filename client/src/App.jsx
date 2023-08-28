import React, { useEffect } from "react";
import { Route, Routes} from "react-router";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Room from "./components/Room/Room";
import RoomUpdate from "./components/Room/RoomUpdate";
import SignUp from "./components/SignUp/SignUp";
import "./scss/main.scss"
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:3002";
const socket = io(ENDPOINT);


export default function App(){
useEffect(() => {},[])

    return (
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route index path="/" element={<Login socket={socket} />} />
            <Route path="/register" element={<SignUp socket={socket} />} />
            <Route path='/dashboard' element={<Dashboard socket={socket} />}/>
            <Route path="/rooms">
              <Route path=":roomId" element={<Room socket={socket} />}/>
              <Route path=":roomId/update" element={<RoomUpdate socket={socket}/>}/>
            </Route>
          </Routes>
        </div>
      </div>
    )
}