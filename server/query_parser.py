# query_parser.py
import os, json
from dotenv import load_dotenv
from groq import Groq
from langchain.prompts import PromptTemplate

load_dotenv()

client = Groq(
    api_key = os.getenv('GROQ_API_KEY')
) 

def get_query_tokens(query):
    chat_completion = client.chat.completions.create(
        messages = [
            {
                "role" : "user",
                "content" :f"${query}. separate the 'weather_terminology', 'region_name' and 'when' from the sentence in json format.If the timeframe is NOT 'today'(such as 'this week', 'upcoming days'), use 'next day' for the 'when' field. If any of the info not found or there is no sentence is given put null as their value. no extra line or explanation. don't give ```json type text.",
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )

    result = chat_completion.choices[0].message.content
    print(result)
    
    try:
        result = json.loads(result)
        return result
    except Exception as e:
        print("Exception occured : ", e)
        
        result = {
            "weather_terminology" : None,
            "region_name" : None,
            "when" : None
        }

        return  result
# print(get_query_tokens(""))
# query_tokens = get_query_tokens("is it gonna rain in dhaka?")

def explain_weather_report(weather_report, weather_terminology):
    chat_completion = client.chat.completions.create(
        messages = [
            {
                "role" : "user",
                "content" :f"$report = {weather_report}. weather_terminology = {weather_terminology}. explain the report about the weather of the given city. No need to explain everything. Just give a brief report on the weather terminology provided to you.Also keep in mind if clouds.add is greater than 70 then you can say it's gonna be cloudy and if humidity is greater than 90 then there is chance of rain. If temparature is high, then give indication of it too. No need to use ** bold sign also.",
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )

    return chat_completion.choices[0].message.content

# print(explain_weather_report(query_tokens))


