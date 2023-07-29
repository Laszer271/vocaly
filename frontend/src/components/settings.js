import React from 'react'
import InputFile from "./inputFile";


const Settings = ({formData,setFormData}) => {


  function handleChange(event){
    console.log(event.target.value)
    setFormData(prevFormData =>({
        ...prevFormData,
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
    }))
  }

  return (
    <form className="flex flex-col items-center ml-5 mt-2 p-3 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 shadow-md k">
      <InputFile value={"Voice sample"} onFileChange={handleChange} />
      <label htmlFor="doSubtitles">
        <div className="cursor-pointer flex w-64 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
            <span className="mr-4">Generate subtitles</span>
            <input
            type="checkbox"
            id="doSubtitles"
            checked={formData.doSubtitles}
            onChange={handleChange}
            name="doSubtitles"
            className="form-checkbox"
            />
        </div>
      </label>

      <div className="w-64 px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-2">
        <label htmlFor="language" className="mr-2">
            Tranlate to:
        </label>
        <select
            id="language"
            value={formData.language}
            onChange={handleChange}
            name="language"
            className="mt-1 block w-full bg-white border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        >
            <option value="English">English</option>
            <option value="Polish">Polish</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
        </select>
        </div>

    </form>
  )
}

export default Settings