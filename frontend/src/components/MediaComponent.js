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
  const [audioFileUrl, setAudioFileUrl] = useState();
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

  // handle file selection
  const handleFileAdd = async (e) => {
    console.log("ADD")
    setPlayingOriginal(false);
    setPlayingProcessed(false)

    //handling choosing wrong type of file
    const fileType = e.target.files[0].type
    console.log(fileType)
    if (title==="Audio" && fileType==="video/mp4"){
      setError("Please select audio format in this section only!")
      return 1
    }
    if (title==="Video" && fileType==="audio/mpeg"){
      setError("Please select video format in this section only!")
      return 1
    }
    setError(null)

    title==="Video" ? setVideoFileUrl(URL.createObjectURL(e.target.files[0])) : setAudioFileUrl(URL.createObjectURL(e.target.files[0]))
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
      const data = new FormData();
      data.append("video", e.target.files[0]);
      setVideoLoading(true)
      console.log(videoLoading)
      try{
        const response = await fetch(url+"/video",{
          // mode: 'cors', // <--- WAŻNE
          method:"POST",
          body: data
        })
        if (!response.ok) {
          throw new Error('Failed to fetch audio file');
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
      const data = new FormData();
      data.append("audio", e.target.files[0]);
      setAudioLoading(true)
      try{
        const response = await fetch(url + "/audio",{
          // mode: 'cors', // <--- WAŻNE
          method:"POST",
          body: data
        })
        if (!response.ok){
          throw new Error('Failed to fetch audio file');
        }
        console.log("Tutaj jestem blob")
        const blob = await response.blob()
        console.log("Czy tu tez")
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
  
  async function handleTextEdition(){
    setDoTextEdit(false);
    try{
      const response = await fetch(url + "/textedition",{
        method: "POST",
        body: JSON.stringify(editText)
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data))
    }
    catch(error){
      console.error("Error posting text:", error);
    }
  }
  
    // handle play control
  const handlePlayChangeOriginal = () => {
    setPlayingOriginal(prevPlayingOriginal => !prevPlayingOriginal);
    };
  const handlePlayChangeProcessed = () => {
    setPlayingProcessed(prevPlayingProcessed => !prevPlayingProcessed);
    };
    
  

  return (
      <div className="media-component">
    {type === 'Video' ? (
      <>
        <div className="flex flex-row justify-between p-6 mb-0">
          <div className="w-1/3 text-left">
            <h1 className="font-bold text-4xl mb-2">{'VoiceCleaner'}</h1>
            <p className="text-lg mb-2">{'Tourettes Talker is an innovative app designed to help individuals with Tourettes Syndrome or stuttering communicate more confidently in English. With user-friendly features, it empowers users to express themselves with ease and clarity.'}</p>
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
              <button onClick={handleTextEdition} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
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
            <h1 className="font-bold text-4xl mb-2">{'VoiceCleaner'}</h1>
            <p className="text-lg mb-2">{'Tourettes Talker is an innovative app designed to help individuals with Tourettes Syndrome or stuttering communicate more confidently in English. With user-friendly features, it empowers users to express themselves with ease and clarity.'}</p>
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
              <button onClick={handleTextEdition} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
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
                <audio controls>
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
                <div className="text-2xl">Video preprocessing...</div>
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
