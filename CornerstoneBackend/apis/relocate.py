import os
import shutil

def move_directory(command, server_root, projectRecord):
    source = server_root+"\\"+projectRecord.projectFilePath

    file_breakdown = projectRecord.projectFilePath.split('\\')
    project_directory = file_breakdown[-1]

    if(command == 'archive'):
        match projectRecord.projectType:
            case 'Warranty':
                clipped_destination = "WARRANTY\\_ARCHIVED WARRANTY\\"
            case 'Project':
                clipped_destination = "PROJECTS\\_ARCHIVED PROJECTS\\"
            case 'Maintenance':
                clipped_destination = "MAINTENANCE\\_ARCHIVED MAINTENANCE\\"

        
    elif(command == 'unarchive'):
        match projectRecord.projectType:
            case 'Warranty':
                clipped_destination = "WARRANTY\\"
            case 'Project':
                clipped_destination = "PROJECTS\\"
            case 'Maintenance':
                clipped_destination = "MAINTENANCE\\"

    

    destination = server_root + "\\" + clipped_destination
    shutil.move(source, destination) 

    setattr(projectRecord, 'projectFilePath', clipped_destination+"\\"+project_directory)


    return