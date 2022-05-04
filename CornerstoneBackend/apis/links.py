import os
import shutil

def get_link_list(filepath):
    os.chdir(filepath)

    tempList = []

    for f in os.listdir(filepath):
        file_name, file_ext = os.path.splitext(f)
        if(file_ext == ""):
            tempList.append(file_name)

    return tempList