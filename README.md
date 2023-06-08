# NCKH2023
# Skindetective
# API: 
###Authen:
- Login [GET]:

        /auth
        /auth/login

- Login [POST]: 

        /auth/login
    - if Error: return {code: 0, message: "Đăng nhập không thành công"}.
    - else: redirect("/home").

- Register [GET]:

        /auth/signup

- Register [POST]:

        /auth/signup
    - if Error: return {code: 1, message: "Error saving to database"}.
    - else: redirect("/auth/login").

### Home