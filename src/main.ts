//
// Custom action of GitHub Actions - Upload file to Google Drive
//
import * as core from '@actions/core';
import { filesize } from "filesize";
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

    // 入力をチェック
    if (parent.length > 0) {
        core.setSecret(parent);
    }
    if (!fs.existsSync(filePath)) {
        core.error(`No such file: ${filePath}`);
        throw new Error("Specified file not found");
    }
    const displayName = name.length > 0 ? name : path.basename(filePath);

    // リクエストボディを構成
    const body = fs.createReadStream(filePath);

    // アップロード
    core.info(`Upload file ${filePath} (display name: ${displayName}) to Google Drive...`);
    uploadFileToDrive(drive, body, displayName, parent, overwrite).then((response) => {
        const fileSizeStr = ((sizeStr) => {
            const size = sizeStr ?? "";
            if (size.length == 0) {
                return "unknown";
            }
            return filesize(Number(size), { spacer: "", standard: "jedec" });
        })(response.data.size);
        core.info(`Finished. (upload size: ${fileSizeStr})`);
    }).catch((error) => {
        core.error(`Failed to upload file: ${error.message}`);
        throw error;
    });
}

main().catch((error) => {
    core.setFailed(error);
});
