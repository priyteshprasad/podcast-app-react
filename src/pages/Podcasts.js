import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { setPodcasts } from "../slices/podcastSlice";
import PodcastCard from "../components/common/Podcasts/PodcastCard";
import InputComponent from "../components/common/Input";

function PodcastsPage() {
  const dispatch = useDispatch();
  const podcasts = useSelector((state)=>state.podcasts.podcasts)
  const [search, setSearch] = useState("");
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastData = [];
        querySnapshot.forEach((doc) => {
          podcastData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastData));
      },
      (error) => {
        console.error(error.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  var filteredPodcasts = podcasts.filter((item)=> item.title.trim().toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "2rem" }}>
        <h1>Discover Podcasts</h1>
        <InputComponent 
            state={search}
            setState={setSearch}
            placeholder={"Search Podcast"}
            type={"text"}
            required={false}
        />
        {filteredPodcasts.length > 0 ? (
            <div className="podcast-flex">
                {filteredPodcasts.map((item)=>{
                    return <PodcastCard key={item.id} id={item.id} title={item.title} displayImage={item.displayImage} />
                })}
            </div>
        ) : <p>{search ? "Podcast not found" : "No podcast"}</p>}
      </div>
    </div>
  );
}

export default PodcastsPage;
