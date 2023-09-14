//
// Custom action of GitHub Actions - Upload file to Google Drive
//
import * as core from '@actions/core';
import * as fs from 'fs';
import * as google from 'googleapis';
import * as path from 'path';
import uploadFileToDrive from './upload';

async function main() {
    // GoogleDrive APIの準備
    const auth = new google.Auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = new google.drive_v3.Drive({ auth: auth });

    // アクションの入力を整理
    const filePath = core.getInput('filepath', { required: true, trimWhitespace: true });
    const name = core.getInput('name', { required: false, trimWhitespace: true });
    const parent = core.getInput('parent', { required: false, trimWhitespace: true });
    const overwrite = core.getBooleanInput('overwrite', { required: false });
    core.setSecret(parent);
    const displayName = name.length > 0 ? name : path.basename(filePath);

    // リクエストボディを構成
    if (!fs.existsSync(filePath)) {
        throw new Error(`no such file: ${filePath}`);
    }
    const body = fs.createReadStream(filePath);

    // アップロード
    await uploadFileToDrive(drive, body, displayName, parent, overwrite);
}

main().catch((error) => {
    core.setFailed(error.message);
});
