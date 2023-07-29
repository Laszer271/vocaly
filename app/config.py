

with open('./credentials/11api.txt', 'r') as f:
    API_KEY_11 = f.read().strip()
    if 'PASTE' in API_KEY_11:
        raise Exception('API_KEY_11 not set')
