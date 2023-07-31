import React from 'react'
import InputFile from "./inputFile";


const Settings = ({formData,setFormData, setVoiceSample}) => {

  const supported_languages ={
    "English": "en",
    "Deutsch": "de",
    "Polish": "pl",
    "Spanish": "es",
    "Italian": "it",
    "French": "fr",
    "Portugese": "pt",
    "Hindi": "hi",
  }

  function handleChange(event){
    console.log(event.target.value)
    console.log(supported_languages[event.target.value])
    setFormData(prevFormData =>({
        ...prevFormData,
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : supported_languages[event.target.value]
    }))
  }

  function handleVoiceSample(e){
    console.log("Voice sample downloaded successfully!")
    const data = new FormData();
    data.append("voiceSample", e.target.files[0]);
    setVoiceSample(data)
    console.log(data)
    console.log(e.target.files[0])
  }

  return (
    <div className="flex flex-col items-center ml-5 mt-2 p-3 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 shadow-md k">
    <InputFile value={"Voice sample"} onFileChange={handleVoiceSample} />
    <form >
      <label htmlFor="doSubtitles">
        <div className="cursor-pointer flex w-64 items-center justify-center px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-6">
            <span className=" mr-4">Generate subtitles:</span>
            <span className={!formData.doSubtitles ? "text-red-700 mr-4" : "text-green-700 mr-4" }>{formData.doSubtitles ? "ON" : "OFF"}</span>
            <input

            type="checkbox"
            id="doSubtitles"
            checked={formData.doSubtitles}
            onChange={handleChange}
            name="doSubtitles"
            className="form-checkbox hidden"
            />
        </div>
      </label>

      <div className="w-64 px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 mb-2">
        <label htmlFor="language" className="mr-2">
            Translate to:
        </label>
        <select
            id="language"
            // value={formData.language}
            onChange={handleChange}
            name="language"
            className="mt-1 block w-full bg-white border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        >
            <option value="No translation">No translation</option>
            <option value="English">English</option>
            <option value="Deutsch">Deutsch</option>
            <option value="Polish">Polish</option>
            <option value="Spanish">Spanish</option>
            <option value="Italian">Italian</option>
            <option value="French">French</option>
            <option value="Portugese">Portugese</option>
            <option value="Hindi">Hindi</option>

        </select>
        </div>

    </form>
    </div>
  )
}
export default Settings