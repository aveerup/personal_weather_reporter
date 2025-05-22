import requests, time, os
from dotenv import load_dotenv

load_dotenv()
assembly_ai_api_key = os.getenv("ASSEMBLY_AI_API_KEY")

base_url = "https://api.assemblyai.com"
headers = {"authorization": f"{assembly_ai_api_key}"}

with open("./recorded_audio.wav", "rb") as f:
    response = requests.post(base_url + "/v2/upload", headers=headers, data=f)
    if response.status_code != 200:
        print(f"Error: {response.status_code}, Response: {response.text}")
        response.raise_for_status()
    upload_json = response.json()
    upload_url = upload_json["upload_url"]

data = {
    "audio_url": upload_url,  # For local files use: "audio_url": upload_url
    "speech_model": "slam-1"
}

response = requests.post(base_url + "/v2/transcript", headers=headers, json=data)
if response.status_code != 200:
    print(f"Error: {response.status_code}, Response: {response.text}")
    response.raise_for_status()
transcript_json = response.json()
transcript_id = transcript_json["id"]
polling_endpoint = f"{base_url}/v2/transcript/{transcript_id}"
while True:
    transcript = requests.get(polling_endpoint, headers=headers).json()
    if transcript["status"] == "completed":
        print(f" \nFull Transcript: \n\n{transcript['text']}")
        break
    elif transcript["status"] == "error":
        raise RuntimeError(f"Transcription failed: {transcript['error']}")
    else:
        time.sleep(3)