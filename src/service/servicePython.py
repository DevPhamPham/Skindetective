from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os
import cv2
print(tf.__version__)
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # đọc ảnh đầu vào từ request
    image = request.data
    try:
        # chuyển đổi ảnh 
        img_array = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
        img_resized = cv2.resize(img_array, (128, 128))
        # chuẩn hóa ảnh
        img_normalized = img_resized / 255.0
        # tải model
        model_path = os.path.abspath('./public/DataModel/mobilenetv1')
        model_path2 = os.path.abspath('./public/DataModel/xception')
        # print(model_path)
        model = tf.keras.models.load_model(model_path)
        model2 = tf.keras.models.load_model(model_path2)

        # thực hiện dự đoán trên ảnh đầu vào
        result1 = model.predict(np.expand_dims(img_normalized, axis=0))
        result2 = model2.predict(np.expand_dims(img_normalized, axis=0))
        
        # Lấy trung bình cộng của 2 ma trận kết quả
        result = (result1 + result2) / 2

        # trả về kết quả dự đoán
        return jsonify({'result': result.tolist()})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Something went wrong.','is': e})

if __name__ == '__main__':
    app.run(debug=True)

# from fastapi import FastAPI, Request, Response
# from fastapi.responses import JSONResponse
# import uvicorn
# import tensorflow as tf
# import numpy as np
# import os
# import cv2

# app = FastAPI()

# @app.post('/predict')
# async def predict(request: Request):
#     # đọc ảnh đầu vào từ request
#     image = await request.body()
#     try:
#         # chuyển đổi ảnh 
#         img_array = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
#         img_resized = cv2.resize(img_array, (128, 128))
#         # chuẩn hóa ảnh
#         img_normalized = img_resized / 255.0
#         # tải model
#         model_path = os.path.abspath('./public/DataModel/mobilenetv1')
#         print(model_path)
#         model = tf.keras.models.load_model(model_path)

#         # thực hiện dự đoán trên ảnh đầu vào
#         result = model.predict(np.expand_dims(img_normalized, axis=0))
        
#         # trả về kết quả dự đoán
#         return JSONResponse(content={'result': result.tolist()})
#     except Exception as e:
#         print(e)
#         return JSONResponse(content={'error': 'Something went wrong.','is': e})

# if __name__ == '__main__':
#     uvicorn.run(app, host='0.0.0.0', port=5000)