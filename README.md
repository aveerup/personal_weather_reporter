A weather agent that tends to your weather related queries.

Backend Setup
1.Navigate to the backend directory.
```
  cd "./personal_weather_reporter/server"
```
2.Create a virtual environment.
```
  python -m venv venv
```
3.Activate the virtual environment.
```
  .\venv\Scripts\activate
```
for linux
```
  source venv/bin/activate
```
4.Install the required packages.
```
  pip install -r requirements.txt
```
5.Create a .env file and add the following variables.
```
  OPENWEATHER_API_KEY=
  GROQ_API_KEY=
  MONGO_DB_KEY=
  ASSEMBLY_AI_API_KEY=
```
6.Start the backend server.
```
  python3 server.py
```

The API will be available at http://localhost:5000

Frontend Setup

1.Navigate to the frontend directory.
```
  cd "./personal_weather_reporter/client"
```
2.Install the required packages.
```
  npm install
```
3.Start the frontend server.
```
  npm run dev
```
he frontend will be available at http://localhost:5173
