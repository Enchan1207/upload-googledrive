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
    # 環境変数からクレデンシャルを生成
    google_access_token_key = "GOOGLE_ACCESS_TOKEN"
    google_access_token = os.getenv(google_access_token_key)
    if google_access_token is None:
        print(f"Environment variable {google_access_token_key} is not set.")
        return 1
    credentials = service_account.Credentials.from_service_account_info(info={}, headers={"Authorization": google_access_token})

    try:
        service = build("drive", "v3", credentials=credentials)

        # Call the Drive v3 API
        results = service.files().list(
            pageSize=10, fields="nextPageToken, files(id, name)").execute()
        items = results.get("files", [])

        if not items:
            print("No files found.")
            return 1
        print("Files:")
        for item in items:
            print(u"{0} ({1})".format(item['name'], item['id']))
    except google_api_errors.HttpError as error:
        print(f"An error occurred: {error}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
