import requests
from flask import current_app

def upload_to_ipfs(data):
    api_key = current_app.config['PINATA_API_KEY']
    if not api_key:
        # Return a mock hash
        return 'QmMockHash12345'
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": api_key,
        "pinata_secret_api_key": current_app.config['PINATA_SECRET_KEY']
    }
    files = {'file': ('planet.png', data)}
    resp = requests.post(url, files=files, headers=headers)
    if resp.status_code == 200:
        return resp.json()['IpfsHash']
    return None
