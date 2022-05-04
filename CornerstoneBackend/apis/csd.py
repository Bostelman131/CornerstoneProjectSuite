import os
import shutil

def create(res_names, temp_filepath, new_filepath):
    shutil.copytree(temp_filepath,new_filepath)
    rename(new_filepath, res_names)

def individual_rename(file_path, file_name_extension,res_names):

    file_name, file_ext = os.path.splitext(file_name_extension)

    file_breakdown = file_name.split('$')
    new_name = ""

    for section in file_breakdown:
        if section in res_names:
            new_name = new_name + res_names[section]
        else:
            new_name = new_name + section
    

    old_path = file_path+'\\'+file_name+file_ext
    new_path = file_path+'\\'+new_name+file_ext

    os.rename(old_path, new_path)


def rename(filepath, res_names):
    os.chdir(filepath)

    for f in os.listdir(filepath):
        file_name, file_ext = os.path.splitext(f)

        if(file_ext == ""):
            individual_rename(filepath, f, res_names)
            rename(filepath+"\\"+f, res_names)

        else:
            print(filepath)
            print(f)
            individual_rename(filepath,f,res_names)


