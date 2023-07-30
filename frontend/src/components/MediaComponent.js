import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Button from "./button";
import InputFile from "./inputFile";
import Settings from "./settings";

const MediaComponent = ({ type }) => {
  const title = type;
  const description = `Travel back 66 million years to when majestic
    dinosaurs and extraordinary creatures roamed
    the lands, seas, and skies.`;
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [videoFileUrl, setVideoFileUrl] = useState();
  const [playing, setPlaying] = useState(false);
  const [error,setError]=useState(null)
  const [formData, setFormData] = React.useState(
    {
    doSubtitles: false,
    voiceProbe: null,
    language: ""
})
  const [voiceSample, setVoiceSample] = useState(null)


  // handle file selection
  const handleFileAdd = async (e) => {
    console.log("ADD")
    setPlaying(false);
    
    title==="Video" ? setVideoFileUrl(URL.createObjectURL(e.target.files[0])) : setAudioFileUrl(URL.createObjectURL(e.target.files[0]))

    //handling choosing wrong type of file
    const fileType = e.target.files[0].type
    console.log(fileType)
    if (title==="Audio" && fileType==="video/mp4"){
      setError("Please select audio format in this section only!")
      return 
    }
    if (title==="Video" && fileType==="audio/mpeg"){
      setError("Please select video format in this section only!")
      return 
    }

    setError(null)

        //SETTINGS POST

    //Handle settings post
    try{
      const response = await fetch("/settings",{
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
        const response = await fetch("/voicesample",{
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

      try{
        const response = await fetch("/video",{
          method:"POST",
          body: data
        })
        if (response.ok){
          console.log("Success")
        }
      }
      catch(error){
        throw new Error(error)
      }
    } 

    //Handle audio post
    if(title==="Audio"){
      const data = new FormData();
      data.append("audio", e.target.files[0]);

      try{
        const response = await fetch("/audio",{
          method:"POST",
          body: data
        })
        if (response.ok){
          console.log("Success")
        }
      }
      catch(error){
        throw new Error(error)
      }
    } 
  };

  const handleFileRemove = () =>{
    console.log("DELETE")
    title==="Video" ? setVideoFileUrl(null) : setAudioFileUrl(null)
    setPlaying(false);
  }

    // handle play control
  const handlePlayChange = () => {
      setPlaying(!playing);
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
            </div>

            <div className="w-1/3 flex flex-col items-center justify-center">
                <Settings setFormData={setFormData} formData={formData} setVoiceSample={setVoiceSample}/>
            </div>

              {/* <div className="mt-6">
              <Button value={"Settings"} handleClick={handleFileRemove} />
              </div> */}
          </div>
          <div className="flex flex-row justify-between ">
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
              {videoFileUrl && (
                <>
                  <ReactPlayer width="100%" height="60%" playing={playing} url={videoFileUrl} />
                  <Button ifIcon={true} handleClick={handlePlayChange} />
                </>
              )}
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3"></div>
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
            </div>
            <div className="w-1/3 flex flex-col items-center justify-center">
                <Settings setFormData={setFormData} formData={formData} setVoiceSample={setVoiceSample}/>
              </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-1/2 flex flex-col items-center justify-center mt-0">
              {audioFileUrl && (
                <>
                  <audio controls>
                    <source src={audioFileUrl} type="audio/mpeg" />
                  </audio>
                </>
              )}
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3"></div>
          </div>
        </>
      )}
    </div>
  );
  
};

export default MediaComponent;
