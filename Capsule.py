import os
import time
import shutil
from datetime import datetime

from pprint import pprint

types ={
    "IMG": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    "VID": [".mp4", ".mov", ".m4v", ".mkv", ".avi"],
    "AUD": [".mp3", ".wav", ".m4a", ".aac, .flac", ".ogg"],
    "DOC": [".pdf", ".doc", ".txt"],
}


class Capsule:
    def __init__(self):
        self.id = 'some_id'
        self.upload_dir = "uploads"
        self.capsule_dir = "CAPSULE"
        self.busy = False

        self.check_folder(self.upload_dir)
        self.check_folder(self.capsule_dir)


    def uploads_scan(self):
        if self.busy:
            return
        self.busy = True
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

        files = os.listdir(self.upload_dir)
        for file in files:
            data = self.process_file(file)
        self.busy = False
    
    def check_folder(self, folder):
        if not os.path.exists(folder):
            os.makedirs(folder)

    
    def process_file(self, file):
        print(f"Processing file: {file}")

        # check the file type
        ext = os.path.splitext(file)[1].lower()
        file_type = None
    
        for key, value in types.items():
            if ext in value:
                file_type = key
                break
        
        if file_type is None:
            return # unknown file type
        
        # get the file name and timestamp
        file_name = os.path.splitext(file)[0]

        file_data = {
            "file": file_name,
            "type": file_type,
            "ext": ext,
            "timestamp": time.time()
        } 
        if not file_data['ext']:
            return

        self.move_file(file, file_data)

        return file_data
    
    
    def move_file(self, file, data):
        date_time = datetime.fromtimestamp(data['timestamp'])

        # Store in year/month folder
        year = date_time.strftime("%Y")
        month = date_time.strftime("%m")
        self.check_folder(os.path.join(self.capsule_dir, year))
        self.check_folder(os.path.join(self.capsule_dir, year, month))

        src = os.path.join(self.upload_dir, file)
        filename= f"[{data['type']}]_[{data['timestamp']}]_{data['file']}{data['ext']}"
        dest = os.path.join(self.capsule_dir, year, month, filename)

        shutil.move(src, dest)

        print(f"Moved file: {file} to {dest}")

