#
# サービスアカウントから生成したキーをもとにGoogle APIを叩く
#

import os
import sys
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials


def main() -> int:
    # 環境変数からクレデンシャルを生成
    google_access_token_key = "GOOGLE_ACCESS_TOKEN"
    google_access_token = os.getenv(google_access_token_key)
    if google_access_token is None:
        print(f"Environment variable {google_access_token_key} is not set.")
        return 1
    credentials = Credentials(google_access_token)

    # APIを叩く
    with build("drive", "v3", credentials=credentials) as service:
        results = service.files().list(
            pageSize=10, fields="nextPageToken, files(id, name)").execute()
        items = results.get("files", [])
        print(results)
        print(items)

    return 0


if __name__ == "__main__":
    sys.exit(main())
