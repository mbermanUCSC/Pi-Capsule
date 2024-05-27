from flask import Flask, jsonify, render_template, request
from datetime import datetime
import subprocess

app = Flask(__name__)

@app.route('/')
def home():
    capsule_id = "88567"  # Example capsule ID, replace with dynamic source if needed
    return render_template('index.html', capsule_id=capsule_id)

@app.route('/time')
def time():
    # 12 hour with seconds
    current_time = datetime.now().strftime("%I:%M:%S %p")
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
    print(entry, title)
    return jsonify(success=True, message="Entry saved.")

# file upload
@app.route('/file-upload', methods=['POST'])
def file_upload():
    file = request.files['file']
    file.save(f"uploads/{file.filename}")
    return jsonify(success=True, message="File uploaded.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


