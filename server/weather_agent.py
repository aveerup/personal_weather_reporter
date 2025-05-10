import location_api, query_parser, weather_api

# query = input("What do you want to know?")
def weather_agent(query):
    parsed_query = query_parser.get_query_tokens(query)

    if parsed_query["weather_terminology"] == None:
        return { "response": "Sorry!! I couldn't get your query." }

    if parsed_query["region_name"] == None:
        parsed_query["region_name"] = location_api.get_location()["city"]

    response = weather_api.get_weather(parsed_query["region_name"])

    return query_parser.explain_weather_report(response)


    