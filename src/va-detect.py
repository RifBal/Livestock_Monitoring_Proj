from flask import Flask, Response
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load your YOLO model
model = YOLO("yolo11n.pt")

# Capture from webcam or RTSP
cap = cv2.VideoCapture(0)

# Target dimensions (720p HD)
TARGET_WIDTH = 1280
TARGET_HEIGHT = 720

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Resize frame to 1280x720 BEFORE YOLO processing
        frame = cv2.resize(frame, (TARGET_WIDTH, TARGET_HEIGHT))

        # Run YOLO on the resized frame
        results = model.predict(source=frame, conf=0.5, save=False, verbose=False)

        # Get annotated frame with bounding boxes
        annotated_frame = results[0].plot()

        # Encode annotated frame to JPEG
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        # Yield MJPEG multipart stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/va-stream1')
def yolo_stream():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
