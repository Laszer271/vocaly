
from elevenlabs import set_api_key

def _get_api_key(path: str) -> str:
    try:
        with open(path, 'r') as f:
            api_key = f.read().strip()
    except FileNotFoundError as e:
        raise FileNotFoundError(f'Please create a file called {path} and add your API key there') from e
    return api_key

API_KEY_11 = _get_api_key('./credentials/11api.txt')
set_api_key(API_KEY_11)

LEO_API_KEY = _get_api_key('./credentials/leopard_api.txt')
