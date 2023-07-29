import pvleopard
from typing import Sequence, Optional
import moviepy as mp
import moviepy.editor as editor
import speech_recognition as sr
from moviepy.video.tools.subtitles import SubtitlesClip

API_KEY = r''

# paths
INPUT_AUDIO = 'data/testyxd.wav'
INPUT_VIDEO = 'data/example_video.mp4'
OUTPUT_VIDEO = "data/output_video.mp4"
SUBTITLES = 'data/subtitles.srt'
SUBTITLED_VIDEO = "data/subtitled.mp4"


r = sr.Recognizer()

with sr.AudioFile(INPUT_AUDIO) as source:
    audio_data = r.record(source)
    text = r.recognize_google(audio_data)
    print(text)


audio = editor.AudioFileClip(INPUT_AUDIO)
video = editor.VideoFileClip(INPUT_VIDEO)
final_video = video.set_audio(audio)
final_video.write_videofile(OUTPUT_VIDEO)

leopard = pvleopard.create(
    access_key=API_KEY)


def second_to_timecode(x: float) -> str:
    hour, x = divmod(x, 3600)
    minute, x = divmod(x, 60)
    second, x = divmod(x, 1)
    millisecond = int(x * 1000.)

    return '%.2d:%.2d:%.2d,%.3d' % (hour, minute, second, millisecond)


def to_srt(
        words: Sequence[pvleopard.Leopard.Word],
        endpoint_sec: float = 1.,
        length_limit: Optional[int] = 16) -> str:
    def _helper(end: int) -> None:
        lines.append("%d" % section)
        lines.append(
            "%s --> %s" %
            (
                second_to_timecode(words[start].start_sec),
                second_to_timecode(words[end].end_sec)
            )
        )
        lines.append(' '.join(x.word for x in words[start:(end + 1)]))
        lines.append('')

    lines = list()
    section = 0
    start = 0
    for k in range(1, len(words)):
        if ((words[k].start_sec - words[k - 1].end_sec) >= endpoint_sec) or \
                (length_limit is not None and (k - start) >= length_limit):
            _helper(k - 1)
            start = k
            section += 1
    _helper(len(words) - 1)

    return '\n'.join(lines)


transcript, words = leopard.process_file(INPUT_AUDIO)
with open(SUBTITLES, 'w') as f:
    f.write(to_srt(words))


def generator(txt): return editor.TextClip(
    txt, font='Arial', fontsize=24, color='black')


sub = SubtitlesClip(SUBTITLES, generator)

vid = editor.VideoFileClip(OUTPUT_VIDEO)
sub.set_position(("center", "top"))  # TODO
final = editor.CompositeVideoClip([vid, sub])
final.write_videofile(SUBTITLED_VIDEO, fps=vid.fps)
