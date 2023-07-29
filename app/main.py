from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import re

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
    print("JESTEM")
    data = await video.read()
    save_to = "/home/bartek/Desktop/VoiceCleaningAI/presenhancment/app/video/" + video.filename
    with open(save_to,'wb') as f:
        f.write(data)

    return {"filenames": video.filename}

@app.post("/audio")
async def read_item(audio: UploadFile):
    print("JESTEM")
    data = await audio.read()
    save_to = "/home/bartek/Desktop/VoiceCleaningAI/presenhancment/app/audio/" + audio.filename
    with open(save_to,'wb') as f:
        f.write(data)

    return {"filenames": audio.filename}

