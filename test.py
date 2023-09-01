#
# サービスアカウントから生成したキーをもとにGoogle APIを叩く
#

import os
import sys
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient import errors as google_api_errors


def main() -> int:
    # ファイルからクレデンシャルを生成
    token_key = "GOOGLE_GHA_CREDS_PATH"
    credential_file_path = os.getenv(token_key)
    if credential_file_path is None:
        print(f"Environment variable {token_key} is not set.")
        return 1
    with open(credential_file_path) as f:
        credential_json = json.JSONDecoder().decode(f.read())
        print(credential_json.keys())

    creds = service_account.Credentials.from_service_account_file(credential_file_path)

    try:
        service = build('drive', 'v3', credentials=creds)

        # Call the Drive v3 API
        results = service.files().list(
            pageSize=10, fields="nextPageToken, files(id, name)").execute()
        items = results.get('files', [])

        if not items:
            print('No files found.')
            return 1
        print('Files:')
        for item in items:
            print(u'{0} ({1})'.format(item['name'], item['id']))
    except google_api_errors.HttpError as error:
        print(f'An error occurred: {error}')
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
