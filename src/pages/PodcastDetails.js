import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import EpisodeDetails from "../components/common/Podcasts/EpisodDetails";

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  const getData = async () => {
    try {
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data: ", docSnap.data());
        setPodcast({ id: id, ...docSnap.data() });
      } else {
        console.log("No such document");
        toast.error("No such document");
        navigate("/podcasts");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(()=>{
    const unsubscribe = onSnapshot(
        query(collection(db, "podcasts", id, "episodes")),
        (querySnapshot) => {
            const episodesData =[];
            querySnapshot.forEach((doc) => {
                episodesData.push({id: doc.id, ...doc.data()})
            })
            setEpisodes(episodesData)
        },
        (error)=>{
            console.error("Error Fetching Episodes:", error)
        }
    );
    return ()=>{
        unsubscribe()
    }
  }, [id])

  return (
    <>
      <Header />
      <div className="input-wrapper">
        {podcast?.id && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h1 style={{ textAlign: "left", width: "100%" }}>
                {podcast.title}
              </h1>
              {podcast.createdBy === auth.currentUser.uid && (
                <Button
                  style={{ width: "200px", marginRight: "0px" }}
                  text={"Create Episode"}
                  onClick={() => {
                    navigate(`/podcast/${id}/create-an-episode`);
                  }}
                />
              )}
            </div>
            <div className="banner-wraper">
              <img src={podcast.bannerImage} alt="" />
            </div>
            <p style={{ textAlign: "left", width: "100%" }} className="podcast-description">{podcast.description}</p>
            <h1 style={{ textAlign: "left", width: "100%" }} className="podcast-title-heading">Episods</h1>
            {episodes.length > 0 ? (
                <>
                {episodes.map((episode, index)=>{
                    return <EpisodeDetails key={index} index={index+1} title={episode.title} description={episode.description} audioFile={episode.audioFile} onClick={(file)=>console.log("Playing file"+ file)} />
                })}
                </>
            ) : (<><p>No Episodes</p></>)}
          </>
        )}
      </div>
    </>
  );
}

export default PodcastDetails;
