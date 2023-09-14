//
// Google Driveにファイルをアップロードする
//
import * as google from 'googleapis';

/**
 * 指定されたファイルをアップロードする
 * @param drive GoogleDriveインスタンス
 * @param body アップロードするファイルの内容
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 * @param overwrite 同名のファイルが存在する場合に上書きするかどうか
 */
export default async function uploadFileToDrive(
    drive: google.drive_v3.Drive,
    body: any,
    displayName: string,
    parentID: string | undefined,
    overwrite: boolean = false): Promise<google.Common.GaxiosResponse<google.drive_v3.Schema$File>> {

    if (overwrite) {
        const sameNameFileIDs = await queryFileIDByName(drive, displayName, parentID);
        if (sameNameFileIDs.length > 0) {
            const fileID = sameNameFileIDs[0];
            return await updateExistingFile(drive, fileID, body);
        }
    }

    return await createNewFile(drive, body, displayName, parentID);
}

/**
 * ファイルを新規作成
 * @param drive GoogleDriveインスタンス
 * @param body アップロードするファイルの内容
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 */
async function createNewFile(
    drive: google.drive_v3.Drive,
    body: any,
    displayName: string,
    parentID: string | undefined) {
    const parents = parentID ? [parentID] : undefined;
    const response = await drive.files.create({
        requestBody: {
            parents: parents,
            name: displayName
        },
        media: {
            body: body
        }
    });
    return response;
}

/**
 * 既存ファイルを更新
 * @param drive GoogleDriveインスタンス
 * @param fileID ファイルID
 * @param body 更新するファイルの内容
 */
async function updateExistingFile(
    drive: google.drive_v3.Drive,
    fileID: string,
    body: any | undefined
) {
    const response = await drive.files.update({
        fileId: fileID,
        media: {
            body: body
        }
    });
    return response;
}

/**
 * ファイルの表示名からIDを求める
 * @param drive GoogleDriveインスタンス
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 */
async function queryFileIDByName(
    drive: google.drive_v3.Drive,
    displayName: string,
    parentID: string | undefined): Promise<string[]> {
    const query = `name = '${displayName}'` + (parentID !== undefined ? ` and '${parentID}' in parents` : "");
    const response = await drive.files.list({
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        q: query
    });
    const files = response.data.files;
    const idLists = files?.flatMap((file) => { return file.id ?? [] });
    return idLists ?? [];
}
