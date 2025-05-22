from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

db_key = os.getenv("MONGO_DB_KEY")
client = MongoClient(f"mongodb+srv://avee:{db_key}@cluster0.6zpvyru.mongodb.net/")
db = client["weather_agent"]

# db.users.insert_one({
#     "name" : "avee",
#     "password" : 123,
#     "email" : "avee@gmail.com"
# })

# db.users.delete_one({"name" : "avee"})


