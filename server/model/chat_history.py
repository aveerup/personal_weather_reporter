from . import db
current_db = db.db

def set_chat_history(email, prompt, response):
    user = current_db.users.find_one({"email" : email})

    if user:
        current_db.chat_history.insert_one({
            "email" : email,
            "prompt" : prompt,
            "response" : response
        })

        return True, "chat history updated"
    else:
        return False, "Can't set chat history. No such user."

def get_chat_history(email):
    user = current_db.users.find_one({"email" : email})

    if user:
        chat_cursor = current_db.chat_history.find({"email":email})
        chat_list = list(chat_cursor)

        return True, chat_list
    else:
        return False, []
    
