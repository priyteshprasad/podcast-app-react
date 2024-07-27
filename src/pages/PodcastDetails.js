import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { toast } from "react-toastify";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import EpisodeDetails from "../components/common/Podcasts/EpisodDetails";
import AudioPlayer from "../components/common/Podcasts/AudioPlayer";
import { deleteObject, ref } from "firebase/storage";

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [playingFile, setPlayingFile] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getData = async () => {
    try {
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data: ", docSnap.data());
        setPodcast({ id: id, ...docSnap.data() });
      } else {
        toast.error("No such document");
        navigate("/podcasts");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapshot) => {
        const episodesData = [];
        querySnapshot.forEach((doc) => {
          episodesData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodesData);
        console.log("episodes", episodes);
      },
      (error) => {
        console.error("Error Fetching Episodes:", error);
      }
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const deleteEpisode = async (index, audioFile, episodeId) => {
    const podcastId = podcast.id;
    setDeleteLoading(true);
    try {
      const audioRef = ref(storage, audioFile);
      deleteObject(audioRef)
        .then(() => {
          toast.success("Audio file deleted successfully");
        })
        .catch((error) => {
          toast.error("Could not delete " + error.message);
        });

      await deleteDoc(doc(db, "podcasts", podcastId, "episodes", episodeId));

      toast.success("Episode deleted successfully");
      delete episodes[index];
      setDeleteLoading(false);
    } catch (error) {
      toast.error(error.message);
      setDeleteLoading(false);
    }
  };

  const handleDeletePodcast =() => {
    const confirmDelete = window.confirm('Are you sure you want to delete the files?');
    if (confirmDelete) {
      // Proceed with the delete operation
      console.log("Deleting")
    } else {
      // If the user clicks "Cancel", return without executing the deletion
      console.log('Deletion canceled');
    }
  }

  const deletePodcast = async () => {
    // delete all the audio files
    episodes.forEach(async (episode) => {
      const audioRef = ref(storage, episode.audioFile);
      await deleteObject(audioRef)
        .then(() => {
          toast.success(`${episode.title}'s Audio file deleted successfully`);
        })
        .catch((error) => {
          toast.error("Could not delete " + error.message);
        });
    });
    // delete podcast object
    await deleteDoc(doc(db, "podcasts", podcast.id))
      .then(() => {
        toast.success(`${podcast.title} Podcast deleted successfully`);
        navigate("/podcasts");
      })
      .catch((error) => {
        toast.error("Could not delete " + error.message);
      });
  };

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
                <>
                  <Button
                    style={{ width: "200px", marginRight: "0px" }}
                    text={"Create Episode"}
                    onClick={() => {
                      navigate(`/podcast/${id}/create-an-episode`);
                    }}
                  />
                  <Button
                    style={{
                      width: "200px",
                      marginRight: "0px",
                      backgroundColor: "#ef555538",
                    }}
                    text={"Delete Podcast"}
                    onClick={handleDeletePodcast}
                  />
                </>
              )}
            </div>
            <div className="banner-wraper">
              <img src={podcast.bannerImage} alt="" />
            </div>
            <p
              style={{ textAlign: "left", width: "100%" }}
              className="podcast-description"
            >
              {podcast.description}
            </p>
            <h1
              style={{ textAlign: "left", width: "100%" }}
              className="podcast-title-heading"
            >
              Episods
            </h1>
            {episodes.length > 0 ? (
              <>
                {episodes.map((episode, index) => {
                  return (
                    <EpisodeDetails
                      key={index}
                      index={index + 1}
                      title={episode.title}
                      description={episode.description}
                      audioFile={episode.audioFile}
                      onClick={(file) => {
                        setPlayingFile(file);
                      }}
                      isDeletable={podcast.createdBy === auth.currentUser.uid}
                      deleteEpisode={() =>
                        deleteEpisode(index, episode.audioFile, episode.id)
                      }
                      loading={deleteLoading}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <p>No Episodes</p>
              </>
            )}
          </>
        )}
      </div>
      {playingFile && (
        <AudioPlayer audioSrc={playingFile} image={podcast.displayImage} />
      )}
    </>
  );
}

export default PodcastDetails;
