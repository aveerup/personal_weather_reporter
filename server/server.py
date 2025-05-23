from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import weather_agent, os, json
import model.users
import model.chat_history
import transcribe_audio

app = Flask(__name__)

CORS(app, resources={r'/*': {"origins": "*"}}, supports_credentials = True)

@app.route("/home",methods=['POST', 'GET', 'OPTIONS'])
def home():
    if request.method == 'POST':
        print(request)
        data = request.get_json()
        user_email = data.get('user_email')
        print("user email ", user_email)
        prompt = data.get('prompt')
        print(prompt)
        response = weather_agent.weather_agent(prompt)
        result = jsonify({"response" : response})
        print(result)

        if user_email != "":
            model.chat_history.set_chat_history(user_email, prompt, response)

        return result, 200
    elif request.method == 'GET':
        return "I am in home get", 200
    else:
        return "I am in home", 200
    

UPLOAD_FOLDER = "audio_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
@app.route("/audioPrompt", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    user_email = request.form["user_email"]
    print("user email ", user_email)
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    text_prompt = transcribe_audio.speech_to_text("./audio_uploads/recording.wav")
    # print("text prompt ", type(text_prompt))

    result = {"response" : weather_agent.weather_agent(text_prompt)}
    # print(result)

    return jsonify(result), 200

    
@app.route("/home/createUser", methods=['POST'])
def home_create_new_user():
    data = request.get_json()

    name = data.get('name')
    password = data.get('password')
    email = data.get('email')
    
    res, res_message = model.users.set_user(name, password, email)

    return {
        "res": res,
        "res_message":res_message
    }

@app.route("/home/changeUser", methods=['POST'])
def home_change_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    print(email)
    print(password)

    res, res_message = model.users.verify_user(email, password)

    return {
        "res" : res,
        "res_message" : res_message
    }

if __name__ == "__main__":
    app.run(debug = True)