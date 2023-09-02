#
# サービスアカウントから生成したキーをもとにGoogle APIを叩く
#

import os
import sys

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload


def main() -> int:
    # 環境変数からクレデンシャルを生成
    google_access_token_key = "GOOGLE_ACCESS_TOKEN"
    google_access_token = os.getenv(google_access_token_key)
    if google_access_token is None:
        print(f"Environment variable {google_access_token_key} is not set.")
        return 1
    credentials = Credentials(google_access_token)

    # 書き込み先のフォルダIDを取得
    folder_id_key = "FOLDER_ID"
    folder_id = os.getenv(folder_id_key)
    if folder_id is None:
        print(f"Environment variable {folder_id_key} is not set.")
        return 1

    file_name = "example.txt"
    with open(file_name, "w") as f:
        f.write("Hello, World!")

    # APIを叩く
    with build("drive", "v3", credentials=credentials) as drive_service:
        media = MediaFileUpload(file_name, mimetype='text/plain')
        file_metadata = {'name': file_name, 'parents': [folder_id]}
        drive_service.files().create(body=file_metadata, media_body=media).execute()

    return 0


if __name__ == "__main__":
    sys.exit(main())
