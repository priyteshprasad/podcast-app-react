import React, { useState } from "react";
import { toast } from "react-toastify";
import InputComponent from "../common/Input";
import Button from "../common/Button";
import FileInput from "../common/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreatePodcastForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (title && desc && displayImage && bannerImage) {
      // 1. Upload files -> get downloadable links (we need the image src, use fire store)
      // 2. create a nse doc in a new collection called podcasts
      // 3. save this new podcast episodes states in our podcasts
      setLoading(true)
      try {
        const bannerImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerImageRef, bannerImage);
        const bannerImageUrl = await getDownloadURL(bannerImageRef);
        // console.log("banner Image", bannerImageUrl);

        const displayImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImageRef, displayImage);
        const displayImageUrl = await getDownloadURL(displayImageRef);
        // console.log("displayImage Image", displayImageUrl);

      const podcast =  await addDoc(collection(db, 'podcasts'), { //random uid if not specified
          title: title,
          description: desc,
          createdBy: auth.currentUser.uid,
          bannerImage: bannerImageUrl,
          displayImage: displayImageUrl
      })
      setTitle("")
      setDesc("")
      setBannerImage(null)
      setDisplayImage(null)
      setLoading(false)
      toast.success("File uploaded"); 
      navigate(`/podcast/${podcast.id}`)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error(error.message);
      }
    } else {
      setLoading(false)
      toast.error("Please fill all the values");
    }
  };
  const bannerImageHandle = (file) => {
    setBannerImage(file);
  };
  const displayImageHandle = (file) => {
    setDisplayImage(file);
  };
  return (
    <>
      <InputComponent
        state={title}
        setState={setTitle}
        placeholder="Title"
        type="text"
        required={true}
      />
      <InputComponent
        state={desc}
        setState={setDesc}
        placeholder="Description"
        type="text"
        required={true}
      />
      <FileInput
        accept={"image/+"}
        id="display-image-input"
        fileHandle={displayImageHandle}
        text={"Display Image Upload"}
      />
      <FileInput
        accept={"image/+"}
        id="banner-image-input"
        fileHandle={bannerImageHandle}
        text={"Banner Image Upload"}
      />
      <Button
        text={loading ? "Loading..." : "Create Podcast"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </>
  );
}

export default CreatePodcastForm;
