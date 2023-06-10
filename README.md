# NCKH2023
# Skindetective

## Requirements:

- Python Shell environment (version 3.)
- Node.js enviroment
- package for python:
    - flask:

            pip install flask

    - tensorflow:

            pip install tensorflow

    - numpy:
    
            pip install numpy

    - cv2:

            pip install opencv-python

- npm i | npm start

## API: 
### Authen:
- Login [GET]:

        /auth
        /auth/login

- Login [POST]: 

        /auth/login
    - if Error: return {code: 0, message: "Đăng nhập không thành công"}.
    - else: return {code: 1, message: "Đăng nhập thành công"}.

- Register [GET]:

        /auth/signup

- Register [POST]:

        /auth/signup
    - if Error: return {code: 1, message: "Error saving to database"}.
    - else: redirect("/auth/login").

### Home:

- Predict [POST]:

        /upload

    - Sample result:

            {
                results:
                [
                    {
                        name: 'Seborrheic Keratoses and other Benign Tumors',
                        predict: 0.1332184225320816
                    },
                    {
                        name: 'Melanoma Skin Cancer Nevi and Moles',
                        predict: 0.1253679096698761
                    },
                    {
                        name: 'Warts Molluscum and other Viral Infections',
                        predict: 0.06476469337940216
                    },
                    {
                        name: 'Bullous Disease Photos ( bọng nước)',
                        predict: 0.06012539938092232
                    },
                    {
                        name: 'Nail Fungus and other Nail Disease',
                        predict: 0.05986941605806351
                    },
                    { name: 'Systemic Disease', predict: 0.05923227593302727 }
                ]
            }
