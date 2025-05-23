import location_api, query_parser, weather_api

# query = input("Dhaka")     
def weather_agent(query):
    parsed_query = query_parser.get_query_tokens(query)

    print("parsed query ", parsed_query)

    if parsed_query["weather_terminology"] == None and parsed_query["when"] == None:
        return "Sorry!! Some unexpected error occured. I didn't understand your query."

    if parsed_query["weather_terminology"] == None:
        parsed_query["weather_terminology"] = "sunny or rainy"

    if parsed_query["region_name"] == None:
        parsed_query["region_name"] = location_api.get_location()["city"]

    if parsed_query["when"] == None:
        response = weather_api.get_weather(parsed_query["region_name"])
    else:
        response = weather_api.get_weather(parsed_query["region_name"], parsed_query["when"])

    return query_parser.explain_weather_report(response, parsed_query["weather_terminology"])

# print(weather_agent("Dhaka"))

    