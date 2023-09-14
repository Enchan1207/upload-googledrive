//
// Custom action of GitHub Actions - Upload file to Google Drive
//
import * as google from 'googleapis';
import * as fs from 'fs';
import uploadFileToDrive from './upload';

async function main() {
    // GoogleDrive APIの準備
    const auth = new google.Auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = new google.drive_v3.Drive({ auth: auth });

    // 適当に呼び出す
    const filePath = "README.md"
    const displayName = "README.txt";
    const body = fs.createReadStream(filePath);
    const parentID = undefined;
    return await uploadFileToDrive(drive, body, displayName, parentID, true);
}

main().then(console.log).catch(console.error);
