from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from elevenlabs import set_api_key, clone, generate
from tempfile import NamedTemporaryFile
from pydub import AudioSegment
import speech_recognition as sr
import moviepy.editor as mp
import os
import shutil

from app.config import *

# to start app cd to project root directory and run:
# uvicorn app.main:app --reload
# reference: https://fastapi.tiangolo.com/#run-it

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/video")
async def read_item(video: UploadFile):
    print("Video processing:", video.filename)
    data = await video.read()
    
    # 0. Save video to temp file
    # 1. Get audio from video
    # 2. Get text from audio
    # 3. Clone voice (if needed) from audio
    # 4. Generate new audio from text (and cloned voice)
    # 5. Merge new audio with video
    # 6. Output edited video
    
    # 0. Save video to temp file
    # video_file = NamedTemporaryFile(suffix=video.filename+'.mp4')
    # video_file.write(data)
    print('0. Save video to temp file')
    video_path = "./" + video.filename
    with open(video_path, 'wb') as f:
        f.write(data)

    # 1. Get audio from video
    print('1. Get audio from video')
    r = sr.Recognizer()
    with sr.AudioFile(video_path) as source:
        audio_data = r.record(source)
    # audio_file = NamedTemporaryFile(suffix=video.filename+'.wav')

    print('1.1 Save audio')
    audio_path = 'temp_audio.wav'
    with open(audio_path, 'wb') as audio_file:
        audio_file.write(audio_data.get_wav())

    # 1.5 Convert audio to mp3
    print('1.5 Convert audio to mp3')
    # filename = os.path.basename(audio_file.name)
    mp3_audio_path = audio_path.replace('.wav', '.mp3')
    AudioSegment.from_wav(audio_path).export(mp3_audio_path, format="mp3")

    # 2. Get text from audio
    print('2. Get text from audio')
    text = r.recognize_google(audio_data)
    print(text)

    
    # 3. Clone voice (if needed) from audio


    return {"filenames": video.filename}

@app.post("/audio")
async def read_item(audio: UploadFile):
    print("JESTEM")
    data = await audio.read()
    save_to = "/home/bartek/Desktop/VoiceCleaningAI/presenhancment/app/audio/" + audio.filename
    with open(save_to,'wb') as f:
        f.write(data)

    return {"filenames": audio.filename}


@app.post("/settings")
async def receive_settings(request: Request):
    data = await request.json()
    print(data)
    return {"message": data}

@app.post("/voicesample")
async def read_item(voiceSample: UploadFile):
    print("Voice Sample")
    data = await voiceSample.read()
    save_to = "/home/bartek/Desktop/VoiceCleaningAI/presenhancment/app/voiceSample/" + audio.filename
    with open(save_to,'wb') as f:
        f.write(data)

    return {"filenames": voiceSample.filename}