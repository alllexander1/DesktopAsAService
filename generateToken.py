import json
import base64
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

CIPHER = 'AES-256-CBC'
SECRET_KEY = b'MySuperSecretKeyForParamsToken12'  # 32 bytes key for AES-256

# RDP Token

"""
token_object = {
    "connection": {
        "type": "rdp",
        "settings": {
            "hostname": "192.168.1.200",
            "username": "alex",
            "password": "win10",
            "enable-drive": True,
            "drive-path": '/tmp/alex',
            "create-drive-path": True,
            "security": "any",
            "ignore-cert": True,
            "enable-wallpaper": False,
            "enable-printing": True,
            "audio": ["audio/L8", "audio/L16"],
            "enable-audio-input": True
        }
    }
}
"""

# VNC
token_object = {
    "connection": {
        "type": "vnc",
        "settings": {
            "hostname": "192.168.178.28",
            "username": "alex",
            "password": "vnc",
            "security": "any",
            "ignore-cert": True,
            "enable-audio": True,
            "audio-servername": "192.168.178.28"
        }
    }
}

def encrypt_token(value):
    iv = os.urandom(16)  # 16 bytes for AES
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)

    # Convert value to JSON and pad it
    padded_data = pad(json.dumps(value).encode(), AES.block_size)

    # Encrypt data
    encrypted_data = cipher.encrypt(padded_data)

    # Encode the IV and encrypted data
    data = {
        'iv': base64.b64encode(iv).decode('utf-8'),
        'value': base64.b64encode(encrypted_data).decode('utf-8')
    }

    # Convert the data dictionary to JSON and then encode it
    json_data = json.dumps(data)
    return base64.b64encode(json_data.encode()).decode('utf-8')


token = encrypt_token(token_object)

print("Parameters:")
print(json.dumps(token_object, indent=4))

print("\n\n")

print("Encrypted token:")
print(token)

print("\n\n")

print("Use this token in the URL:")
print("ws://localhost:8080/?token=" + token)