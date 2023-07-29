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
  const [selectedFile, setSelectedFile] = useState();
  // handle file upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    // replace with your server URL
    const url = "https://your-server-url/path-to-upload-endpoint";

    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // if upload successful, set file URL to local object URL
    setFileUrl(URL.createObjectURL(selectedFile));
  };

  const [fileUrl, setFileUrl] = useState();
  const [playing, setPlaying] = useState(false);

  // handle file selection
  const handleFileChange = (e) => {
    setFileUrl(URL.createObjectURL(e.target.files[0]));
    setPlaying(false);
  };

  // handle play control
  const handlePlayChange = () => {
    setPlaying(!playing);
  };

  // handle pause control
  const handlePause = () => {
    setPlaying(false);
  };
  return (
    <div className="media-component">
      <div className="flex flex-row justify-between p-10 ">
        <div className="w-1/2 text-left">
          <h1 className="font-bold text-4xl mb-2">{title}</h1>
          <p className="text-lg mb-2">{description}</p>
          <p className="text-sm text-gray-500">Be patient!</p>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
          <InputFile icon={true} value={"Place your " + title} onFileChange={handleFileChange}/>
          <Button value={"Remove"} />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
          {fileUrl && (
            <>
              <ReactPlayer width="100%" height="70%" playing={playing} url={fileUrl} />
              <Button ifIcon={true} handleClick={handlePlayChange} />
            </>
          )}
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center space-y-3">
  
        </div>
      </div>
    </div>
  );
  
};

export default MediaComponent;
