import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./Library.scss"
import Cut from './Cut';

export default function ProfilSection() {

  const urlCreatePlaylist = "http://localhost:8080/api/users/createPlaylist"
  const auth = JSON.parse(localStorage.getItem("user"))
  const userCuts = auth ? [...auth.libraries.cuts] : null
  const [cuts, setCuts] = useState(userCuts)
  const userPlaylists = auth ? [...auth.libraries.playlists] : null
  const [playlists, setPlaylists] = useState(userPlaylists)
  const [modalPlaylist, setModalPlaylist] = useState(false)
  const [modalCut, setModalCut] = useState(false)
  const [playlistsName, setPlaylistsName] = useState("")
  const [playlistToDelete, setPlaylistToDelete] = useState("")  

  useEffect(() => {

    const getPlaylists = async () => {
      
      await axios.post("http://localhost:8080/api/users/getAllPlaylists", 
      {
        "email": auth.email
      }, 
      {
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => setPlaylists(res.data.playlists))
      .catch(err => console.log("error", err))
    }
    const getCuts = async () => {
        await axios.post("http://localhost:8080/api/users/getAllCuts",
        {
            "email": auth.email,
        })
        .then(res => setCuts(res.data.cuts))
        .catch(err => console.log(err))
    }
    getPlaylists()
    getCuts()
  }, [auth.email])

  /*--- YOUTUBE API SECTION ---*/
  
  const [videoUrl,setVideoUrl] = useState("")
  const [startVideo, setStartVideo] = useState(0)
  const [endVideo, setEndVideo] = useState(0)
  const [videoTitle, setVideoTitle] = useState("")
  
  const handleVideoUrl = (e) => {
    setVideoUrl(e.target.value)
  }
  const handleStartVideo = (e) => {
    setStartVideo(parseFloat(e.target.value))
  }
  const handleEndVideo = (e) => {
    setEndVideo(parseFloat(e.target.value))
  }
  const handleVideoTitle = (e) => {
    setVideoTitle(e.target.value)
  }
  const handleAddACut = async (e) => {
    e.preventDefault()
    await axios.post("http://localhost:8080/api/users/createCut",
      {
        "email": auth.email,
        "videoUrl":videoUrl,
        "cutName":videoTitle,
        "cutStart":startVideo,
        "cutEnd":endVideo,
        "playlistName": playlistsName
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(res=>res.data)
    .catch(err => console.log("error", err))
  }

  const cutInMainPlaylist = []

   /*--- YOUTUBE API SECTION ---*/
  
  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    setPlaylists([...playlists, {playlistName: playlistsName, cuts: [], rooms: []}])
    await axios.post(urlCreatePlaylist, 
      {
        "email": auth.email,
        "playlistName": playlistsName
      }, 
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(res=>res.data)
    .catch(err => console.log("error", err))
  }
  const handlePlaylistName = (e) => {
    setPlaylistsName(e.target.value)
  }
  const handleDeletePlaylist = async (e) => {
    e.preventDefault()
    await axios.post("http://localhost:8080/api/users/deletePlaylist", 
      {
        "email": auth.email,
        "playlistName": playlistToDelete
      }, 
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(setPlaylists(playlists.filter(playlist => playlist.playlistName !== playlistToDelete)))
    .catch(err => console.log("error", err))
  }
  const handleModalPlaylist = () => {
    setModalPlaylist(!modalPlaylist)
    setModalCut(false)
  }
  const handleModalCut = () => {
    setModalCut(!modalCut)
    setModalPlaylist(false)
  }
  return (
    <section className="dashboard-sub dashboard-sub__library">
      <div className="dashboard-sub__library-header">
        <h1>Ma librairie</h1>
        <div className='create'>
          <span className='create-button' onClick={handleModalPlaylist}>+ Créer une playlist</span>
          <span className='create-button' onClick={handleModalCut}>+ Ajouter un cut</span>
        </div>
      </div>
      <div className="my-playlists">
          {playlists && playlists.map((playlist, index) => 
              <div className="playlist" key={index}>
                <div className="playlist-infos">
                  <h3 className='playlist-infos__name'>{playlist.playlistName}</h3>
                  <div className="playlist-infos__shared">
                    {
                      cuts.map(cut =>
                        cut.playlists.map(playlistCut =>
                          {if(playlistCut.playlistName === playlist.playlistName) {
                            cutInMainPlaylist.push(cut.cutName)
                          }}
                          )
                        )
                    }
                    <p>{cutInMainPlaylist.length + " cuts"}</p>
                    <p className=''>{"sur "+playlist.rooms.length + " rooms"}</p>
                  </div>
                <form className='playlist-delete' onSubmit={handleDeletePlaylist}>
                  <button onClick={()=>{setPlaylistToDelete(playlist.playlistName)}} className='playlist-delete'>Delete this playlist</button>
                  <button className='playlist-add-cut'>Ajouter un cut à la playlist</button>
                </form>
                </div>
                <div className="playlist-cuts">
                  {cuts && cuts.map((cut, index) =>
                  cut.playlists.map(playlistCut =>
                    playlistCut.playlistName === playlist.playlistName &&
                    <Cut 
                      index={index}
                      cut={cut}
                    />
                  )
                  )}
                </div>
              </div>  
              )}
        </div>
          {modalPlaylist &&
            <form className='create-playlist' onSubmit={handleCreatePlaylist}>
              <input onChange={handlePlaylistName} type="text" placeholder="Nom de la playlist"/>
              <button>Créer la playlist</button>
            </form>
          }
          {modalCut &&
           <>
            <form className='create-cut' onSubmit={handleAddACut}>
              <input onChange={handleVideoUrl} placeholder="URL du cut youtube"/>
              <input onChange={handleVideoTitle} placeholder="Nom du cut"/>
              <input onChange={handleStartVideo} placeholder="Début du cut en seconde"/>
              <input onChange={handleEndVideo} placeholder="Fin du cut en seconde"/>
              <input onChange={handlePlaylistName} placeholder="Ajouter ce cut dans une playlist" />
              <button>Ajouter le cut</button>
            </form>

             <div>
           </div>
           </>
          }
    </section>
    )
}