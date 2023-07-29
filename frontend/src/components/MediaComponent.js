import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios"; // Tylko jeśli rzeczywiście używasz axios w swoim komponencie
import Button from "./button";
import InputFile from "./inputFile";

const MediaComponent = ({ type }) => {
  const title = type;
  const description = `Travel back 66 million years to when majestic
    dinosaurs and extraordinary creatures roamed
    the lands, seas, and skies.`;
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [videoFileUrl, setVideoFileUrl] = useState();
  const [playing, setPlaying] = useState(false);
  const [error,setError]=useState(null)


  // handle file selection
  const handleFileAdd = async (e) => {
    console.log("ADD")
    setPlaying(false);

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
          <div className="flex flex-row justify-between p-10">
            <div className="w-1/2 text-left">
              <h1 className="font-bold text-4xl mb-2">{title}</h1>
              <p className="text-lg mb-2">{description}</p>
              <p className="text-sm text-gray-500">Be patient!</p>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
              {error && error}
              <InputFile icon={true} value={"Place your " + title} onFileChange={handleFileAdd} />
              <Button value={"Remove"} handleClick={handleFileRemove} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
              {videoFileUrl && (
                <>
                  <ReactPlayer width="100%" height="70%" playing={playing} url={videoFileUrl} />
                  <Button ifIcon={true} handleClick={handlePlayChange} />
                </>
              )}
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3"></div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between p-10">
            <div className="w-1/2 text-left">
              <h1 className="font-bold text-4xl mb-2">{title}</h1>
              <p className="text-lg mb-2">{description}</p>
              <p className="text-sm text-gray-500">Be patient!</p>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
              {error && error}
              <InputFile icon={true} value={"Place your " + title} onFileChange={handleFileAdd} />
              <Button value={"Remove"} handleClick={handleFileRemove} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
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
