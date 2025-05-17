from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import weather_agent, os

app = Flask(__name__)

db_key = os.getenv("MONGO_DB_KEY")
client = MongoClient(f"mongodb+srv://avee:{db_key}@cluster0.6zpvyru.mongodb.net/")
db = client["weather_agent"]

# db.users.insert_one({
#     "name" : "avee",
#     "password" : 123,
#     "email" : "avee@gmail.com"
# })

# db.users.delete_one({"name" : "avee"})

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

if __name__ == "__main__":
    app.run(debug = True)