from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import weather_agent, os, json
import model.users

app = Flask(__name__)

CORS(app, resources={r'/*': {"origins": "*"}}, supports_credentials = True)

@app.route("/home",methods=['POST', 'GET', 'OPTIONS'])
def home():
    if request.method == 'POST':
        print(request)
        data = request.get_json()
        prompt = data.get('prompt')
        print(prompt)
        result = jsonify({"response" : weather_agent.weather_agent(prompt)})
        print(result)

        return result
    elif request.method == 'GET':
        return "I am in home get"
    else:
        return "I am in home"
    
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