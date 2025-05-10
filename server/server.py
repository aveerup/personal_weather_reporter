from flask import Flask, request, jsonify
from flask_cors import CORS
import weather_agent

app = Flask(__name__)
CORS(app)

@app.route("/home",methods=['POST'])
def home():
    print(request)
    data = request.get_json()
    prompt = data.get('prompt')

    return jsonify({"response" : weather_agent.weather_agent(prompt)})


if __name__ == "__main__":
    app.run(debug = True)