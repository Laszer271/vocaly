import translators as ts
import ffmpeg
from elevenlabs import set_api_key, clone, generate, play, save
from moviepy.video.tools.subtitles import SubtitlesClip


supported_languages = ['en',
                       'de',
                       'pl',
                       'es',
                       'it',
                       'fr',
                       'pt',
                       'hi']


def translate_text(text, language):
    return ts.translate(text, to_language=language)


def translate_subtitles(input_file, output_file, language):
    with open(input_file) as f:
        lines = f.readlines()
    out_text = ts.translate(lines, to_language=language)
    with open(output_file, 'w') as f:
        f.write(out_text)


def synth_voice_from_text(text):
    with open('credentials/11api.txt', 'r') as f:
        API_KEY_11 = f.read().strip()
        set_api_key(API_KEY_11)

    set_api_key(API_KEY_11)

    audio = generate(
        text=text,
        voice="Bella",
        model="eleven_multilingual_v1"
    )
    save(audio, "audio.mp4")
