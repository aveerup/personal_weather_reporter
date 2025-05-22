# import db
from . import db
import json
current_db = db.db
from werkzeug.security import generate_password_hash, check_password_hash


def set_user(name, password, email):
    try:
        same_email_user = current_db.users.find_one({"email" : email})
    
        if same_email_user == None:
            current_db.users.insert_one({
                "name" : name,
                "password" : generate_password_hash(password), 
                "email" : email    
            })

            return True, "Successfully added a user"
        else:
            return False, "The email already in use"

    except Exception as e:
        print("Exception at set_user in users.py: ", e)
    
    return False, "Internal error"


def get_user(email):
    try:
        wanted_user = current_db.users.find_one({"email" : email})

        if wanted_user == None:
            return False, "user not found"
        else:
            return True, json.dumps(wanted_user)
    
    except Exception as e:
        print("Exception at get_user in users.py: ", e)

    return False, "Internal error"


def verify_user(email, password):
    try:
        wanted_user = current_db.users.find_one({"email" : email},{"_id":0})

        if wanted_user == None:
            return False, "No user with given email"
        else:
            verify = check_password_hash(wanted_user["password"], password)
            if verify:
                return True, wanted_user
            else:
                return False, "Wrong email or password"
    except Exception as e:
        print("Exception at verify_user in users.py : ", e)

# set_user("c", "123", "c@gmail.com")
# print(verify_user("c@gmail.com", "123"))   
