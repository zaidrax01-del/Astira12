import requests
from flask import current_app

FALLBACK_IMAGE = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

def upload_to_ipfs(data):
    api_key = current_app.config.get('PINATA_API_KEY')
    if not api_key:
        return FALLBACK_IMAGE

    try:
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            "pinata_api_key": api_key,
            "pinata_secret_api_key": current_app.config.get('PINATA_SECRET_KEY')
        }
        files = {'file': ('planet.png', data)}
        resp = requests.post(url, files=files, headers=headers)
        if resp.status_code == 200:
            return resp.json()['IpfsHash']
        else:
            print(f"Pinata upload failed: {resp.status_code} {resp.text}")
            return FALLBACK_IMAGE
    except Exception as e:
        print(f"Pinata error: {e}")
        return FALLBACK_IMAGE
