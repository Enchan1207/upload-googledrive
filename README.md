# upload-googledrive v1

This action uploads file to Google Drive using [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/provide-credentials-adc).

## Usage

Before invoke this action, please authenticate to Google Cloud and set up [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation).  
Example when using [google-github-actions/auth](https://github.com/marketplace/actions/authenticate-to-google-cloud):

```yml
- uses: google-github-actions/auth@v1
  id: google_auth
  with:
    workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider'
    service_account: 'my-service-account@my-project.iam.gserviceaccount.com'
    access_token_scopes: https://www.googleapis.com/auth/drive
```

After that:

```yml
- uses: Enchan1207/upload-googledrive@v1
  with:
    # Path of the file to upload.
    filepath: /path/to/file
    
    # File's display name on Google Drive. If not specified, last component of filepath will be used.
    # Default: ''
    name: ''

    # Folder identifier of Google Drive to be placed. If not specified, file will be placed at the root of the service account's drive.
    # Default: ''
    parent: ''

    # Whether to overwrite a file with the same name if it exists. If set this false, a new file with the same name will be created.
    # Default: false
    overwrite: false
```

## Notices

The file will be uploaded to Google Drive of **authenticated service account**. To access uploaded files from Google Drive, share your folder with service account and pass its identifier to the action's `parent`.
Also note that uploading to a shared folder will (potentially) still consume drive space in your service account.

## License

This repository and action is published under [MIT License](https://github.com/Enchan1207/upload-googledrive/blob/master/LICENSE).
