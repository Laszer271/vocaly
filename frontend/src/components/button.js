import React, { useState } from 'react';
import "@heroicons/react/24/solid";
import { PlayCircleIcon, StopIcon } from '@heroicons/react/24/solid';

const Button = ({value, handleClick, ifIcon}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleButtonClick = () => {
    setIsPlaying(!isPlaying);
    handleClick();
  };

  return (
    <button onClick={handleButtonClick} className="flex w-64 h-10 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
      {ifIcon && (isPlaying ? <StopIcon className="w-6 h-6 mr-2"/> : <PlayCircleIcon className="w-6 h-6 mr-2"/>)}
      {value}
    </button>
  )
}

export default Button;
