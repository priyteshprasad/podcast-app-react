import React, { useState } from "react";
import Header from "../components/common/Header";
import InputComponent from "../components/common/Input";
import FileInput from "../components/common/Input/FileInput";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { upload } from "@testing-library/user-event/dist/upload";

function CreateAnEpisode() {
  const {id} = useParams();
  const[title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioFileHandle = (file) => {
    setAudioFile(file)
  }
  const handleSubmit = async () => {
    setLoading(true)
    if({title, desc, audioFile}){
      try {
        const audioRef = ref(storage, `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`)
        await uploadBytes(audioRef, audioFile)
        const audioUrl = await getDownloadURL(audioRef)
        const episodeData = {
          title: title,
          description: desc,
          audioFile: audioUrl
        }
        await addDoc(
          collection(db, "podcasts", id, "episodes"),
          episodeData
        )

        toast.success("Episode created successfully")
        setLoading(false)
        navigate(`/podcast/${id}`)
      } catch (e) {
        toast.error(e.message)
        setLoading(false)
        
        setTitle("")
        setDesc("")
        setAudioFile(null)
      }
    }else{
      toast.warning("Fill all required input fields")
      setLoading(false)
    }
  }
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1>Create An Episode</h1>
        <InputComponent
          state={title}
          setState={setTitle}
          placeholder={"Title"}
          type={"text"}
          required={true}
        />
        <InputComponent
          state={desc}
          setState={setDesc}
          placeholder={"Description"}
          type={"text"}
          required={true}
        />
        <FileInput
          accept={"audio/*"}
          id={"audio-file-input"}
          fileHandle={audioFileHandle}
          text={"Upload Audio File"}
        />
        <Button 
          text={loading ? "Loading...": "Create Episode"}
          disabled={loading}
          onClick={handleSubmit}
          />
      </div>
    </div>
  );
}

export default CreateAnEpisode;