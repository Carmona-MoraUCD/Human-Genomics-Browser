# Testing Upload on Demo Website

## Acquire Access from Admin
User won't be able to access the resources even after you make an account on login screen.\
Whether before or after you make an account, once admin user add your email to the user management, user will obtain an authoritiy to access resources.

## Test Upload
Make sure there is no same dataset was uploaded by other users.\
Our system updates the dataset when same file name was upload. Thus, it might hard to identify whether the upload was processed properly.\
Use below files to test uploading dataset.\
[File Type 1](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/ranking_csv_check.csv)\
[File Type 1 - Different patient code](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/diff_code_na.csv)\
[File Type 2](https://github.com/Carmona-MoraUCD/Human-Genomics-Browser/blob/main/sample_data/dataset_type2_3pats.csv)\
Once user download the file, access to the upload page.\
Use the reference below to fill out the information on that page before click on the submit button:
```
Dataset CSV File Upload - Choose the file downloaded
Description ------------- Optional. Used for describing what the dataset is for
URL --------------------- Optional. If the original raw dataset is shared in shared drive services, it can be post in here
Dataset Row Type -------- Used for the system to identify the dataset type. File Type 1 is "patient". File Type 2 is "gene"
Gene Code --------------- Required when dataset row type is "gene". It will be "ENSG" for test dataset
Patient Code ------------ Required when dataset row type is "patient". It will be "UCDSS" for "File Type 1" and "AAUCD" for "File Type 1 - Different patient code"
```
Once user upload the data and the processed successfully on server, changes will appear on gene / dataset pages.

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
