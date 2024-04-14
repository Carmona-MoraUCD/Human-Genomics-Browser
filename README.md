# Introduction

This is the source code for developers and readme for users of the web app, described here: https://zenodo.org/doi/10.5281/zenodo.10426520
("A customizable secure DIY web application for accessing, sharing, and browsing aggregate experimental results and metadata").

The web app was conceived as a way to share aggregated results, browse data in progress, and all the information that is key for analysis, including location or any other features from tabular data or metadata, but that is publicly unshareable due to their work-in-progress or sensitive nature. Therefore, such information must be accessible for authorized users only. The web application allows researchers to share and record tabular data, while interacting in different ways, such as bookmarking, and linking to external open knowledgebases. 

Our code was designed to be customizable, so our platform can be replicated from the code by anyone, in the same form to use in any discipline, or it can be linked to different databases or allowing different features, which represents a no- to low-cost DIY platform. Researchers can access this code to re-create their own platform, adding authorized users through their own login system. Our application can facilitate data and metadata access, which is especially useful for scholarly writing processes, as the information from a research team will be accessed mostly through the application, in lieu to scattered information in an array of files or third-party storage services. 


# Testing Upload on Demo Website

## Acquire Access from Admin
User will not be able to access the resources even after the user creates an account on the login screen.\
Whether before or after you create an account, once admin user adds your email to user management, user will get an authority to access resources.

## Test Upload
Make sure that the same dataset has not been uploaded by other users.\
Our system updates the dataset when the same filename is uploaded. So it might be hard to identify whether the upload was processed properly.\
If the user wants to delete the uploaded dataset, the user can do so from the dataset page.\
Use the following files to test the upload of the dataset.\
[File Type 1](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/ranking_csv_check.csv)\
[File Type 1 - Different patient code](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/diff_code_na.csv)\
[File Type 2](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/dataset_type2_3pats.csv)\
Once the user has downloaded the file, visit the upload page.\
Use the reference below to fill in the information on the upload page before clicking the submit button:
```
Dataset CSV File Upload - Choose the file downloaded
Description ------------- Optional. Used for describing what the dataset is used for
URL --------------------- Optional. If the original raw dataset is shared in shared drive services and has a shared link, it can be posted here.
Dataset Row Type -------- Used for the system to identify the dataset type. File Type 1 is "patient". File Type 2 is "gene"
Gene Code --------------- Required when dataset row type is "gene". It will be "ENSG" for "File Type 2".
Patient Code (sample ID) ------------ Required when dataset row type is "patient or sample". 
```
Once the user uploads the data and it is successfully processed on the server, changes will appear on the gene/dataset pages.

# For Development - Setup Guide

## Preparing Keys

Developers are required to setup their own database and authentication service and write keys in environment variables to run the app locally.\
Developers must make .env file in the root directory and copy the block below.\
Do not have spaces to avoid unexpected errors.
```
REACT_APP_BACKEND_URL=
DATABASE_CONNECTION_STRING=
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_AUTH0_CLIENT_SECRET=
REACT_APP_AES_PRIVATE_KEY=
```
Since this information is used to access the database or other critical parts of the web application, developers **must avoid sharing it under any circumstances**.\
`.env` is already added to [`.gitignore`](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/.gitignore), but it will be *developer's responsibility to make sure if the file or information is not uploaded to public area*.

### Backend URL
After deploying backend to server, the URL to access that server is required.\
Paste to `REACT_APP_BACKEND_URL`

### MongoDB
After you make your account, create a cluster.\
Once you create a role in the cluster, it will provide you a link to access database.\
Paste the link to `DATABASE_CONNECTION_STRING`.

### Auth0
Create account in Auth0 and create tenant.\
From configuration you should be able to get domain, client ID, and its key to access service.
Paste domain to `REACT_APP_AUTH0_DOMAIN`\
Paste client ID to `REACT_APP_AUTH0_CLIENT_ID`\
Paste key to `REACT_APP_AUTH0_CLIENT_SECRET`

### Other
For `REACT_APP_AES_PRIVATE_KEY`, developers can run `openssl enc -aes-128-cbc -k -secret -P -pbkdf2` to generate random values.\
Any value works for this key because it will be used to encrypt information when it is sent to the backend. But it must not be something an outsider can find out.


## Frontend

### `npm start`

Command to run the app in the development mode (runs locally).\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser (make sure port 3000 is not used in your machine. Usually, after you run the command, console will provide the local host url).

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
Use this for deployment.

## Backend

### Running virtual environment
Open console and run command below to prepare environment for Python3. Necessary package are on [requirements.txt](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/requirements.txt)\
Developing on this environment will avoid "*but it works on my machine*" situation.\
Windows: `.\genomics_browser_venv\Scripts\activate`\
Mac: `source genomics_browser_venv/Scripts/activate`

### Kill virtual environment
Windows & Mac: deactivate

### Run Test
Running this test allows developers to check whether they have filled in enough information to connect to the database.
1. Change directory to genomics_browser_django_project/
2. run: python manage.py test

## Documentation
To get know more about the application click [here](https://docs.google.com/document/d/1hcC7I3j7zIeZzKS3vapvWQNSpuW-f43TKsUm23EZ6ec/edit?usp=sharing) to go to documentation page. 
