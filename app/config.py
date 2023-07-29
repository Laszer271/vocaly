
try:
    with open('./credentials/11api.txt', 'r') as f:
        API_KEY_11 = f.read().strip()
except FileNotFoundError as e:
    raise FileNotFoundError('Please create a file called 11api.txt in the credentials folder and add your API key for elevenlabs there') from e