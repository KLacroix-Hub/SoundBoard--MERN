import React, { useState,useEffect } from 'react'
import YouTube from 'react-youtube'

export default function Cut(props,{socket}) {
    const [playCut, setPlayCut] = useState(false)
    const [videoId, setVideoId] = useState({"videoId":"","cutName":"", "start":0, "end":0});
    const [user, setUser] = useState("")

    const handlePlayerReady = (e) => {
        e.target.playVideo();
        e.target.seekTo(0);
    }

    const handlePlayVideo = (newVideoId, NewCutName, startVideo, endVideo) => {
        newVideoId = newVideoId.split("v=")[1].split("&")[0];
        setVideoId({"videoId":newVideoId, "cutName":NewCutName, "start":startVideo, "end":endVideo});
        setPlayCut(true);
    };
   
    useEffect(() => {
        
    },[socket])

    const handleSendCut = (user, cut) => {
        socket.emit("share-cut", {
            cut: cut,
            user: user,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
        })
    }

    console.log(user)

  return (
    <>
        <div className='playlist-cuts__item' key={props.index}>
            <img src="https://picsum.photos/150/150" alt="" />
            <p>{props.cut.cutName}</p>
            <p>{props.cut.cutEnd - props.cut.cutStart + "s"}</p>
            <span onClick={()=>{handlePlayVideo(props.cut.videoUrl, props.cut.cutName,props.cut.cutStart, props.cut.cutEnd)}} className="cut-play"><img src="/CutPlay.svg" alt="" /></span>
            {props.isRoom && 
               <>
                    <input onChange={(e)=>setUser(e.target.value)} type="text" />
                    <span
                    className="cut-send"
                    onClick={()=>handleSendCut(user,props.cut.cutName)}
                    >
                        Envoyer
                    </span>
                </>
            }
        </div>
        {playCut &&
            <YouTube 
            videoId={videoId.videoId}
            videoTitle={videoId.cutName}
            onReady={handlePlayerReady}
            className='youtube-player'
            opts={
                {
                    height: '0',
                    width: '0',
                    enablejsapi: 1,
                    
                    playerVars: {
                        fs:0,
                        autoplay: 1,
                        disablekb:1,
                        modestbranding:1,
                        mute:0,
                        rel:0,
                        showinfo:0,
                        controls:0,
                        loop:0,
                        start:videoId.start,
                        end:videoId.end,
                        origin: "http://localhost:3000/dashboard",
                    }
                }
            }
            />  
        }

    </>
  )
}
