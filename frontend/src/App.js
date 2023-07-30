import React, { useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import "./App.css";
import MediaComponent from "./components/MediaComponent";

const AV = ["Video", "Audio"];
function App() {
  const [name, setname] = useState(AV[0])

  return (
    <div className="text-center align-middle bg-[url('/public/img/Bg1.png')] bg-cover w-screen flex items-center justify-center h-screen">

    <div className=" backdrop-filter backdrop-blur-lg bg-gray-900 bg-opacity-30 p-6 rounded-xl text-white h-4/5 w-4/5">
    <div className="text-centerflex space-x-4 mb-0">
      <button 
        onClick={() => {
          setname(AV[0])
        }}
        className={`px-4 py-2 rounded-md ${name === AV[0] ? 'backdrop-filter backdrop-blur-lg bg-white bg-opacity-20' : ''}`}
      >
        {AV[0]}
      </button>
      <button 
        onClick={() => {
          setname(AV[1])
          }}
        className={`px-4 py-2 rounded-md ${name === AV[1] ? 'backdrop-filter backdrop-blur-lg bg-white bg-opacity-20' : ''}`}
      >
        {AV[1]}
      </button>
    </div>
    <MediaComponent type={name}/>
  </div>
  </div>
  );

}

export default App;
