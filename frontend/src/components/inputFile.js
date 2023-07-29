import React, { useRef } from 'react';
import "@heroicons/react/24/solid";
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const Button = ({value, icon, onFileChange}) => {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <input 
        type="file"
        ref={inputRef}
        style={{display: 'none'}}
        onChange={onFileChange}
      />
      <button 
        onClick={handleClick}
        className="flex w-64 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6"
      >
        {icon && <PlayCircleIcon className="w-6 h-6 mr-2"/>}
        {value}
      </button>
    </div>
  )
}

export default Button;
