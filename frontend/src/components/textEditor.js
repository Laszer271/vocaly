import React from 'react'

const TextEditor = ({editText, setEditText}) => {

  function handleChange(e){
    setEditText(e.target.value)
  }
  return (
    <div class="mt-10 w-full h-60 relative">
    <textarea
        value={editText}
        onChange={handleChange}
        name="comments"
        className="resize-both w-full h-full p-4 bg-gray-800 bg-opacity-50 border rounded-sm border-gray-600 text-white"
    ></textarea>
    </div>
  )
}

export default TextEditor