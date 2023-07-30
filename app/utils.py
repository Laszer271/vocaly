from elevenlabs import set_api_key, clone, generate, save
from pydub import AudioSegment
import speech_recognition as sr
import moviepy.editor as mp
import pvleopard
from app.config import *


def save_video(video_data, out_path, verbose=True):
    with open(out_path, 'wb') as f:
        f.write(video_data)
        if verbose:
            print('Video saved to:', out_path)
    return out_path


def get_audio_from_video(video_path, out_path):
    audio = mp.VideoFileClip(video_path).audio # Warning: returns None if no audio track is present in the video
    audio.write_audiofile(out_path)
    return out_path


def convert_wav_to_mp3(wav_path, mp3_path):
    AudioSegment.from_wav(wav_path).export(mp3_path, format="mp3")
    return mp3_path


def get_text_from_audio(audio_path):
    leopard = pvleopard.create(access_key=LEO_API_KEY)
    transcript, words = leopard.process_file(audio_path)
    return transcript


def clone_voice(audio_path):
    voice_name = 'user_voice'
    cloned = clone(
        name=voice_name,
        description='User\'s cloned voice',
        files=[audio_path],
    )
    return cloned


def generate_audio(text, voice_to_use, out_path, model='eleven_multilingual_v1'):
    generated = generate(
        text=text,
        voice=voice_to_use,
        model="eleven_multilingual_v1",
    )
    save(generated, out_path)
    return out_path


def clone_and_generate_audio(text, audio_path, out_path):
    cloned_voice = clone_voice(audio_path)
    return generate_audio(text, cloned_voice, out_path)


def merge_audio_with_video(audio_path, video_path, out_path):
    video = mp.VideoFileClip(video_path)
    audio = mp.AudioFileClip(audio_path)
    final_video = video.set_audio(audio)
    final_video.write_videofile(out_path)
    return out_path

