# query_parser.py
import os, json
from dotenv import load_dotenv
from groq import Groq
from langchain.prompts import PromptTemplate

load_dotenv()

client = Groq(
    api_key = os.getenv('GROQ_API_KEY')
)  # Expected: {"city": ..., "when": ...}

def get_query_tokens(query):
    chat_completion = client.chat.completions.create(
        messages = [
            {
                "role" : "user",
                "content" :f"${query}. separate the weather_terminology and region_name from the sentence in json format. If any of the info not found put None as their value. no extra line. don't give ```json type text.",
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )

    return json.dumps(chat_completion.choices[0].message.content)
    # return chat_completion.choices[0].message.content

print(get_query_tokens("is it gonna rain in dhaka?"))

def explain_weather_report(weather_report):
    chat_completion = client.chat.completions.create(
        messages = [
            {
                "role" : "user",
                "content" :f"${weather_report}. explain the report about the weather of the given city. No need to explain everything. Just give a brief report.",
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )

    return chat_completion.choices[0].message.content


