from flask import Flask, jsonify, render_template, request, send_file
from datetime import datetime, timedelta
import subprocess
import random


from Capsule import Capsule
from Camera import capture_and_save_image

app = Flask(__name__)

capsule = Capsule()

next_image_time = None  # used to schedule image captures

@app.route('/')
def home():
    capsule_id = capsule.id
    return render_template('index.html', capsule_id=capsule_id)

@app.route('/lock-status')
def lock_status():
    return jsonify(locked=not capsule.unlocked, capsule_id=capsule.id)

@app.route('/time')
def time():
    # 12 hour with seconds
    current_time = datetime.now().strftime("%I:%M:%S %p")
    try:
        # if next_image_time is None, set it to a random time in the future (between 1 and 10 hours)
        global next_image_time
        if next_image_time is None:
            capture_and_save_image()
            capsule.uploads_scan()
            next_image_time = datetime.now() + timedelta(hours=random.randint(1, 10))
        # if next_image_time is set, and it's in the past, capture an image
        elif datetime.now() > next_image_time:
            capture_and_save_image()
            capsule.uploads_scan()
            next_image_time = None
    except Exception as e:
        print(f"Failed to capture image: {e}")

    return jsonify(current_time=current_time)

@app.route('/date')
def date():
    current_date = datetime.now().strftime("%Y-%m-%d")  # Format date as YYYY-MM-DD
    return jsonify(current_date=current_date)

@app.route('/power-off', methods=['POST'])
def power_off():
    try:
        subprocess.run(["sudo", "shutdown", "-h", "now"], check=True)
        return jsonify(success=True, message="System is shutting down.")
    except subprocess.CalledProcessError:
        return jsonify(success=False, message="Failed to shut down."), 500

@app.route('/reboot', methods=['POST'])
def reboot():
    try:
        subprocess.run(["sudo", "reboot", "now"], check=True)
        return jsonify(success=True, message="System is rebooting.")
    except subprocess.CalledProcessError:
        return jsonify(success=False, message="Failed to reboot."), 500
    
# print the note
@app.route('/note-entry', methods=['POST'])
def entry():
    entry = request.json['entry']
    title = request.json['title']
    # save as text file
    try:
        with open(f"uploads/{title}.txt", "w") as file:
            file.write(entry)
        capsule.uploads_scan()
        return jsonify(success=True, message="Entry saved.")
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

# file upload
@app.route('/file-upload', methods=['POST'])
def file_upload():
    try:
        file = request.files['file']
        file.save(f"uploads/{file.filename}")
        capsule.uploads_scan()
        return jsonify(success=True, message="File uploaded.")
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

@app.route('/get-capsule-data')
def get_capsule_data():
    capsule_data = capsule.get_capsule()  # dictionary with capsule data
    return jsonify(capsule_data)


# lock capsule, compare the input with the capsule_id
@app.route('/unlock-capsule', methods=['POST'])
def unlock_capsule():
    try:
        capsule_id = request.json.get('capsule_id')
        if capsule_id == capsule.id:
            capsule.unlock()
            return jsonify(success=True, message="Capsule unlocked.")
        else:
            return jsonify(success=False, message="Invalid capsule ID."), 403
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500


# download the capsule (call capsule.zip_capsule(), which returns the path to the zip file)
@app.route('/download-capsule', methods=['POST'])
def download_capsule():
    try:
        zip_file_path = capsule.zip_capsule()
        return send_file(zip_file_path, as_attachment=True, download_name='capsule.zip')
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


