import location_api, query_parser, weather_api

print("Welcome!! I will be your personal weather guide.")

while 1:
    query = input("What do you want to know?")
    parsed_query = query_parser.get_query_tokens(query)
    
    if parsed_query["weather_terminology"] == None:
        print("Sorry!! I couldn't get your query.", end = "")
        continue;
    
    if parsed_query["region_name"] == None:
        parsed_query["region_name"] = location_api.get_location()["city"]

    

    