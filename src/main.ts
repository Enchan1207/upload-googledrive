//
//
//
import * as google from 'googleapis';


async function main() {
    const auth = new google.Auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = new google.drive_v3.Drive({ auth: auth });
    const response = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(name, createdTime)',
    });
    const files = response.data.files;
    const nextPageToken = response.data.nextPageToken;
    console.log(files?.length);
    files?.forEach((file) => {
        console.log(`${file.name} (created: ${file.createdTime})`);
    });
}

main().catch(console.error);
