import React from 'react'

const Button = ({value}) => {
  return (
    <button
    // onClick={() => setActiveButton(!activeButton)}
    className={`px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6`}
  >
    {value}
  </button>
  )
}

export default Button