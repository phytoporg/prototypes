import os
import sys
import pickle
import argparse
import google_auth_oauthlib.flow
import googleapiclient.errors
from googleapiclient.discovery import build

API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'
CREDENTIALS_PICKLE_FILE = os.path.join(os.path.expanduser('~'), 'yt_creds.pickle')

SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

def get_authenticated_service(secrets_file):
    if os.path.exists(CREDENTIALS_PICKLE_FILE):
        with open(CREDENTIALS_PICKLE_FILE, 'rb') as fr:
            credentials = pickle.load(fr)
    else:
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(secrets_file, SCOPES)
        credentials = flow.run_console()
        with open(CREDENTIALS_PICKLE_FILE, 'wb') as fw:
            pickle.dump(credentials, fw)

    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)
