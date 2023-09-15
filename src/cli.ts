#!/usr/bin/env node
//
// GoogleDriveにファイルをアップロードする
//
import { filesize } from "filesize";
import * as fs from 'fs';
import * as google from 'googleapis';
import * as path from 'path';
import yargs from 'yargs';
import uploadFileToDrive from './upload';

async function main() {
    // コマンドライン引数のパース
    const args = yargs
        .option("path", {
            type: 'string',
            description: "source file path",
            demandOption: true
        })
        .option("name", {
            type: 'string',
            description: "display name on Google Drive",
            demandOption: false
        })
        .option("parent", {
            type: 'string',
            description: "parent folder identifier",
            demandOption: false
        })
        .option("overwrite", {
            type: 'boolean',
            description: "overwrite if exists",
            demandOption: true,
            default: false
        })
        .help()
        .parseSync();
    const filePath = args.path as string;
    const fileName = (args.name ?? "").length > 0 ? args.name as string : path.basename(filePath);
    const parentID = args.parent;

    // GoogleDrive APIの準備
    const auth = new google.Auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = new google.drive_v3.Drive({ auth: auth });

    // アップロードして結果を表示
    try {
        const response = await uploadFileToDrive(drive, fs.createReadStream(filePath), fileName, parentID, true);
        const fileInfo = response.data;
        const responseFileID: string = fileInfo.id!;
        const responseFileName: string = fileInfo.name!;
        const responseFileSize: number = Number(fileInfo.size ?? "");

        console.log(`${responseFileName} was uploaded to google drive. (id: ${responseFileID} size: ${filesize(responseFileSize, { spacer: "", standard: "jedec" })})`);
    } catch (error: any) {
        console.error(`Failed to upload file: ${error.message}`);
    }
}

main().catch(console.error);
