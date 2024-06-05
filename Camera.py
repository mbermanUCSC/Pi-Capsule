import cv2
import os
from datetime import datetime

def capture_and_save_image():
    # make sure the uploads directory exists (should already exist, but just in case)
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # start the webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    ret, frame = cap.read()

    if ret:
        # timestamp for the image filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"img_{timestamp}.png"

        # save the image
        cv2.imwrite(os.path.join('uploads', filename), frame)
        print(f"Image saved as {filename}")
    else:
        print("Failed to capture image")

    # release the webcam and close the window
    cap.release()
    cv2.destroyAllWindows()


