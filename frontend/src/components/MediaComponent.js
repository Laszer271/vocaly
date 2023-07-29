import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios"; // Tylko jeśli rzeczywiście używasz axios w swoim komponencie
import Button from "./button";

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
  const handlePlay = () => {
    setPlaying(true);
  };

  // handle pause control
  const handlePause = () => {
    setPlaying(false);
  }
  const [activeButton, setActiveButton] = useState(true);
  return (
    <div className="media-component">
      <div className="flex flex-row">
        <div className="basis-1/2 text-left">
          <h1 className="font-bold">{title}</h1>
          {description}
          <br />
          Documentary · 1 hr 3 min
        </div>
        <div className="basis-1/2 flex flex-col text-center ">
          <Button value={"Place your " + type} />
          <Button value={"Remove" } />

        </div>
      </div>
      {/* {type === "video" ? (
        <ReactPlayer url={fileUrl} controls playing={false} />
      ) : type === "voice" ? (
        <audio controls>
          <source src={fileUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : null} */}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        {fileUrl && <ReactPlayer playing={playing} url={fileUrl} />}
      </div>
    </div>
  );
};

export default MediaComponent;
