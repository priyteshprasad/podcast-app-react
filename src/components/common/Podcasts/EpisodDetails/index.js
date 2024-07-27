import React from "react";
import Button from "../../Button";
import Loader from "../../Loader";

function EpisodeDetails({ index, title, description, audioFile, onClick, isDeletable, deleteEpisode , loading}) {
  const handleDelete =async () =>{
    deleteEpisode() 
  }
  return (
    <div style={{width: "100%"}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>

      <h1 style={{textAlign: "left", marginBottom: "0px"}}>
        {index}. {title}
      </h1>
      {isDeletable && (loading ? <div><Loader/></div> : <p onClick={handleDelete} style={{cursor: "pointer"}}>&#128465;</p>)}
      </div>
      <p style={{marginLeft: "1.2rem"}} className="podcast-description">{description}</p>
      <Button text={"Play"} onClick={() => onClick(audioFile)} style={{width:"300px"}}/>
    </div>
  );
}

export default EpisodeDetails;
