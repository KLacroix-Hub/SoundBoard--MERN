import React from 'react'

export default function ButtonActivePlaylist({ actif,activePlaylist, onClick }) {
    // console.log("playlist", activePlaylist)
    // console.log("actif", actif)
  return (
    <button
        className={activePlaylist  ? "btn-active active": "btn-active"}
        onClick={onClick}
    >
  </button>
  )
}
