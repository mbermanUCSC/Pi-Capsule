import os
import time
import re
import shutil
from datetime import datetime

import random
import string

from pprint import pprint

types ={
    "IMG": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    "VID": [".mp4", ".mov", ".m4v", ".mkv", ".avi"],
    "AUD": [".mp3", ".wav", ".m4a", ".aac, .flac", ".ogg"],
    "DOC": [".pdf", ".doc", ".txt"],
}

def gen_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


class File:
    def __init__(self, name, ext, timestamp):
        self.name = name
        self.ext = ext
        self.timestamp = timestamp

    def __str__(self):
        return f"{self.name} - {self.ext} - {self.timestamp}"

    def __repr__(self):
        return f"{self.name} - {self.ext} - {self.timestamp}"

class Capsule:
    def __init__(self):
        self.id = gen_id()
        self.upload_dir = "uploads"
        self.capsule_dir = "CAPSULE"
        self.busy = False

        self.unlocked = False

        self.start()
        

    def start(self):
        # if file capsule_data.json exists, load the data
        if os.path.exists("capsule_data.txt"):
            self.load()
        else:
            self.save()
        self.check_folder(self.upload_dir)
        self.check_folder(self.capsule_dir)

    def save(self):
        # save unlocked to txt, just true or false
        with open("capsule_data.txt", "w") as file:
            # clear the file
            file.seek(0)
            file.truncate()
            file.write(str(self.id))
            file.write("\n")
            file.write(str(self.unlocked))


    def load(self):
        # load unlocked status
        with open("capsule_data.txt", "r") as file:
            self.id = file.readline().strip()
            self.unlocked = file.readline().strip() == "True"
            

    # scans the uploads folder and processes the files
    def uploads_scan(self):
        if self.busy: # prevents multiple scans at the same time
            return
        self.busy = True
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

        files = os.listdir(self.upload_dir)
        for file in files:
            data = self.process_file(file)
        self.busy = False
    
    # checks if a folder exists, if not creates it
    def check_folder(self, folder):
        if not os.path.exists(folder):
            os.makedirs(folder)

    
    # processes a file and moves it to the CAPSULE
    def process_file(self, file):
        if self.unlocked:
            return
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
        if self.unlocked:
            return
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

    def get_file(self, file):
        # Use a regular expression to match the pattern
        pattern = r'\[(.*?)\]_\[(.*?)\]_(.*)'
        match = re.match(pattern, file)
        if not match:
            raise ValueError("The file string format is incorrect")
        # Extracting type, timestamp, and name
        file_type, timestamp, name = match.groups()
        timestamp = float(timestamp)  # convert string to float for timestamp
        return File(name, file_type, timestamp)

    def get_capsule(self):
        capsule = {}
        for root, dirs, files in os.walk(self.capsule_dir):
            path_parts = root.split(os.sep)
            # The last two parts of the path will be the year and month
            if len(path_parts) > 2:
                year, month = path_parts[-2], path_parts[-1]
                year = int(year)
                month = int(month)
                if year not in capsule:
                    capsule[year] = {}
                if month not in capsule[year]:
                    capsule[year][month] = {}
                for file in files:
                    file_obj = str(self.get_file(file))
                    # Use file object itself as the value, or just the file name
                    capsule[year][month][file] = file_obj
        return capsule
    
    def unlock(self):
        self.unlocked = True
        self.save()

    def zip_capsule(self):
        try:
            archive_path = f"{self.id}.zip"
            shutil.make_archive(self.id, 'zip', self.capsule_dir)
            print(f"Created capsule archive: {archive_path}")
            return archive_path
        except Exception as e:
            print(f"Failed to create capsule archive: {e}")
            return None


# c = Capsule()
# c.uploads_scan()
# pprint(c.get_capsule())