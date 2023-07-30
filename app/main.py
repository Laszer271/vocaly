from fastapi import FastAPI, Request, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware

from tempfile import NamedTemporaryFile
import os
import shutil

from app.config import *
from app.utils import *

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

saved_settings = None
saved_voice_sample = None


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
    # 6. Clean the temp files
    # 7. Output edited video
    
    # 0. Save video to temp file
    print('0. Save video to temp file')
    video_path = save_data(data, './' + video.filename)

    # 1. Get audio from video
    print('1. Get audio from video')
    audio_path = get_audio_from_video(video_path, 'temp_audio.wav')

    # 1.5 Convert audio to mp3
    print('1.5 Convert audio to mp3')
    mp3_audio_path = convert_wav_to_mp3(audio_path, audio_path.replace('.wav', '.mp3'))
    
    # 2. Get text from audio
    print('2. Get text from audio')
    transcript = get_text_from_audio(mp3_audio_path)
    print(transcript)
    
    # 3. Clone voice (if needed) from audio
    print('3. Clone voice (if needed) from audio')
    voice = clone_voice(mp3_audio_path)
    
    # 4. Generate new audio from text (and cloned voice)
    print('4. Generate new audio from text (and cloned voice)')
    generated_audio_path = generate_audio(transcript, voice, 'temp_generated.wav')

    # 5. Merge new audio with video
    print('5. Merge new audio with video')
    final_video_path = merge_audio_with_video(generated_audio_path, video_path, 'temp_final_video.mp4')

    # 5.5 Convert video to bytes
    print('5.5 Convert video to bytes')
    with open(final_video_path, "rb") as f:
        final_video_bytes = f.read()

    # 6. Clean the temp files
    print('6. Clean the temp files')
    os.remove(video_path)
    os.remove(audio_path)
    os.remove(mp3_audio_path)
    os.remove(generated_audio_path)
    os.remove(final_video_path)
    voice.delete()

    # 7. Output edited video
    print('7. Output edited video')
    return Response(content=final_video_bytes, media_type="video/wav")

@app.post("/audio")
async def read_item(audio: UploadFile):
    print("Video processing:", audio.filename)
    data = await audio.read()
    
    # 0. Save audio to temp file
    # 1. Convert audio to mp3
    # 2. Get text from audio
    # 3. Clone voice (if needed) from audio
    # 4. Generate new audio from text (and cloned voice)
    # 5. Merge new audio with vidaudioo
    # 6. Clean the temp files
    # 7. Output edited video
    
    # 0. Save video to temp file
    print('0. Save audio to temp file')
    audio_path = save_data(data, './' + audio.filename)

    # 1.5 Convert audio to mp3
    print('1 Convert audio to mp3')
    mp3_audio_path = convert_wav_to_mp3(audio_path, audio_path.replace('.wav', '.mp3'))
    
    # 2. Get text from audio
    print('2. Get text from audio')
    transcript = get_text_from_audio(mp3_audio_path)
    print(transcript)
    
    # 3. Clone voice (if needed) from audio
    print('3. Clone voice (if needed) from audio')
    voice = clone_voice(mp3_audio_path)
    
    # 4. Generate new audio from text (and cloned voice)
    print('4. Generate new audio from text (and cloned voice)')
    generated_audio_path = generate_audio(transcript, voice, 'temp_generated.wav')

    # 5.5 Convert video to bytes
    print('5.5 Convert audio to bytes')
    with open(generated_audio_path, "rb") as f:
        final_audio_bytes = f.read()

    # 6. Clean the temp files
    print('6. Clean the temp files')
    os.remove(audio_path)
    os.remove(mp3_audio_path)
    os.remove(generated_audio_path)
    voice.delete()

    # 7. Output edited video
    print('7. Output edited video')
    return Response(content=final_audio_bytes, media_type="audio/mp3")


@app.post("/settings")
async def receive_settings(request: Request):
    data = await request.json()
    print(data)
    return {"message": data}

@app.post("/voicesample")
async def read_item(voiceSample: UploadFile):
    print("Voice Sample")
    data = await voiceSample.read()
    save_to = "/home/bartek/Desktop/VoiceCleaningAI/presenhancment/app/voiceSample/" + voiceSample.filename
    with open(save_to,'wb') as f:
        f.write(data)

    return {"filenames": voiceSample.filename}

