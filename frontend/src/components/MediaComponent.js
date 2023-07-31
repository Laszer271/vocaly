import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Button from "./button";
import InputFile from "./inputFile"
import {Puff} from "react-loader-spinner"
import Settings from "./settings";
import {url} from "../utilis/url";
import TextEditor from "./textEditor";


const MediaComponent = ({ type }) => {
  const title = type;
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingProcessed, setPlayingProcessed] = useState(false);
  const [error,setError]=useState(null)
  const [formData, setFormData] = React.useState(
    {
    doSubtitles: false,
    voiceProbe: null,
    language: "No translation"
})
  const [voiceSample, setVoiceSample] = useState(null)
  const [returnedVideo,setReturnedVideo] = useState(null)
  const [returnedAudio,setReturnedAudio] = useState(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [editText,setEditText]=useState('')
  const [doTextEdit,setDoTextEdit]=useState(false) 
  const [message, setMessage] = useState("");


  // handle file selection
  const handleFileAdd = async (e) => {
    console.log("ADD")
    setPlayingOriginal(false);
    setPlayingProcessed(false)

    //handling choosing wrong type of file
    const fileType = e.target.files[0].type
    console.log(fileType)
    if (title==="Audio" && !fileType.startsWith("audio/")){
      setError("Please select audio format in this section only!")
      return 1
    }
    if (title === "Video" && !fileType.startsWith("video/")){
      setError("Please select video format in this section only!")
      return 1
    }
    setError(null)

    // title==="Video" ? setVideoFileUrl(URL.createObjectURL(e.target.files[0])) : setAudioFileUrl(URL.createObjectURL(e.target.files[0]))

    console.log("Filename: " , e.target.files[0].name)
    console.log("Original: ",URL.createObjectURL(e.target.files[0]))
    console.log("useState: ",audioFileUrl)
    console.log("useState dla video: ",videoFileUrl)


        //SETTINGS POST

    //Handle settings post
    console.log(url)
    try{
      const response = await fetch(url+"/settings",{
        // mode: 'cors', // <--- WAŻNE
        method:"POST",
        body: JSON.stringify(formData)
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
    }
    catch(error){throw new Error(error)}

    //Handle voice sample
    if(voiceSample){
      try{
        console.log("Voice sample")
        console.log(voiceSample)
        const response = await fetch(url+"/voicesample",{
          // mode: 'cors', // <--- WAŻNE
        method:"POST",
          body: voiceSample
        })
        if (response.ok){
          console.log("Success")
          console.log(response)
        }
      }
      catch(error){
        throw new Error(error)
      }
    }

        //END

    //Handle video post
    if(title==="Video"){
      setVideoFileUrl(URL.createObjectURL(e.target.files[0])) 
      const data = new FormData();
      data.append("video", e.target.files[0]);
      setVideoLoading(true)
      setReturnedVideo(null)
      console.log(videoLoading)
      try{
        const response = await fetch(url+"/video",{
          // mode: 'cors', // <--- WAŻNE
          method:"POST",
          body: data
        })
        if (!response.ok) {
          throw new Error('Failed to fetch video file');
        }
        const blob = await response.blob()
        const videoBlobUrl = URL.createObjectURL(blob)
        setReturnedVideo(videoBlobUrl)
        setVideoLoading(false)
      }
      catch(error){
        throw new Error(error)
      }
    } 

    //Handle audio post
    if(title==="Audio"){
      setAudioFileUrl(URL.createObjectURL(e.target.files[0])) 
      const data = new FormData();
      data.append("audio", e.target.files[0]);
      setAudioLoading(true)
      setReturnedAudio(null)
      try{
        const response = await fetch(url + "/audio",{
          // mode: 'cors', // <--- WAŻNE
          method:"POST",
          body: data
        })
        if (!response.ok){
          throw new Error('Failed to fetch audio file');
        }
        const blob = await response.blob()
        const audioBlobUrl = URL.createObjectURL(blob)
        setReturnedAudio(audioBlobUrl)
        setAudioLoading(false)
      }
      catch(error){
        throw new Error(error)
      }
    } 
  };

  //Handle file removing
  const handleFileRemove = () =>{
    console.log("DELETE")
    if (title === "Video") {
      setVideoFileUrl(null);
      setReturnedVideo(null);
    } else {
      setAudioFileUrl(null);
      setReturnedAudio(null);
    }
    setPlayingOriginal(false);
    setPlayingProcessed(false)
  }

  //Handle text edition - Getting text from server side
  async function handleTextFetch() {
    setDoTextEdit(true);
    try {
      const response = await fetch(url + "/textedition");
      if (response.ok) {
        const data = await response.json();
        const newText = data.text; 
        console.log(newText)
        setEditText(newText);
      } else {
        console.error("Error fetching text from the server.");
      }
    } catch (error) {
      console.error("Error fetching text:", error);
    }
  }
  
  async function handleTextEdition(isVideo){
    setDoTextEdit(false);
    console.log(isVideo)
    if (isVideo){
      setVideoLoading(true)
      setReturnedVideo(null)
    }else{
       setAudioLoading(true) 
       setReturnedAudio(null)
    }
    console.log(audioLoading)
    console.log(returnedVideo, videoLoading)
    try{
      const response = await fetch(url + "/textedition",{
        method: "POST",
        body: JSON.stringify(editText)
      })
      if (!response.ok){
        console.error("Failed")
      }
      const blob = await response.blob()
      const videoBlobUrl = URL.createObjectURL(blob)
      if (isVideo){
        setVideoLoading(false)
        setReturnedVideo(videoBlobUrl)
      }else{
         setAudioLoading(false) 
         setReturnedAudio(videoBlobUrl)
      }
    }
    catch(error){
      console.error("Error posting text:", error);
    }
  }
  

  return (
      <div className="media-component">
    {type === 'Video' ? (
      <>
        <div className="flex flex-row justify-between p-6 mb-0">
          <div className="w-1/3 text-left">
            <h1 className="font-bold text-4xl mb-2">{'Vocaly'}</h1>
            <p className="text-lg mb-2">{'Vocaly - Your Voice, Your Way! Transform, Filter, and Express Yourself with Confidence. Experience the power of our app to customize your speech, turning your voice into a unique and seamless expression of your thoughts and emotions.'}</p>
            <p className="text-sm text-gray-500">Be patient!</p>
          </div>
          <div className="w-1/3 flex flex-col items-center justify-center mt-0">
            {error && error}
            <InputFile icon={true} value={"Place your " + title} onFileChange={handleFileAdd} />
            <Button value={"Remove"} handleClick={handleFileRemove} />
            {returnedVideo && (!doTextEdit ? (
              <button onClick={handleTextFetch} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
                Change Text
              </button>
            ) : (
              <button onClick={() => handleTextEdition(true)} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
                Save Changes
              </button>
            ))}
          </div>
          <div className="w-1/3 flex flex-col items-center justify-center">
            <Settings setFormData={setFormData} formData={formData} setVoiceSample={setVoiceSample} />
          </div>
        </div>

        {doTextEdit ? (
            <TextEditor editText={editText} setEditText={setEditText} />
          ) : null}
        <div className="flex flex-row justify-between">

          <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
            {(videoFileUrl && !doTextEdit) && (
              <>
                <ReactPlayer width="100%" height="70%" playing={playingOriginal} url={videoFileUrl} controls={true} />
                {/* <Button ifIcon={true} handleClick={handlePlayChangeOriginal} /> */}
              </>
            )}
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
            {(returnedVideo && !doTextEdit) ? (
              <>
                <ReactPlayer width="100%" height="70%" playing={playingProcessed} url={returnedVideo} controls={true} />
              </>
            ) : videoLoading ? (
              <>
                <div className="text-2xl">Video preprocessing...</div>
                <Puff color="#008080" height={100} width={100} />
              </>
            ) : null}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="flex flex-row justify-between p-6 mb-0">
          <div className="w-1/3 text-left">
            <h1 className="font-bold text-4xl mb-2">{'Vocaly'}</h1>
            <p className="text-lg mb-2">{'Vocaly - Your Voice, Your Way! Transform, Filter, and Express Yourself with Confidence. Experience the power of our app to customize your speech, turning your voice into a unique and seamless expression of your thoughts and emotions.'}</p>
            <p className="text-sm text-gray-500">Be patient!</p>
          </div>
          <div className="w-1/3 flex flex-col items-center justify-center mt-0">
            {error && error}
            <InputFile icon={true} value={"Place your " + title} onFileChange={handleFileAdd} />
            <Button value={"Remove"} handleClick={handleFileRemove} />
            {returnedAudio && (!doTextEdit ? (
              <button onClick={handleTextFetch} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
                Change Text
              </button>
            ) : (
              <button onClick={() => handleTextEdition(false)} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
                Save Changes
              </button>
            ))}
          </div>
          <div className="w-1/3 flex flex-col items-center justify-center">
            <Settings setFormData={setFormData} formData={formData} setVoiceSample={setVoiceSample} />
          </div>
        </div>
        {doTextEdit ? (
            <TextEditor editText={editText} setEditText={setEditText} />
          ) : null}
        <div className="flex flex-row justify-between">
          <div className="w-1/2 flex flex-col items-center justify-center mt-20">
          {(audioFileUrl && !doTextEdit) && (
            <>
                <audio controls key={audioFileUrl}>
                  <source src={audioFileUrl} type="audio/mpeg" />
                </audio>
              </>
            )}
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center  mt-20">
            {(returnedAudio && !doTextEdit) ? (
              <>
                <audio controls>
                  <source src={returnedAudio} type="audio/mpeg" />
                </audio>
              </>
            ) : audioLoading ? (
              <>
                <div className="text-2xl">Audio preprocessing...</div>
                <Puff color="#008080" height={100} width={100} />
              </>
            ) : null}
          </div>
        </div>
      </>
    )}
  </div>

  );
  
};

export default MediaComponent;
