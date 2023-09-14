"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 指定されたファイルをアップロードする
 * @param drive GoogleDriveインスタンス
 * @param body アップロードするファイルの内容
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 * @param overwrite 同名のファイルが存在する場合に上書きするかどうか
 */
function uploadFileToDrive(drive, body, displayName, parentID, overwrite = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (overwrite) {
            const sameNameFileIDs = yield queryFileIDByName(drive, displayName, parentID);
            if (sameNameFileIDs.length > 0) {
                const fileID = sameNameFileIDs[0];
                return yield updateExistingFile(drive, fileID, body);
            }
        }
        return yield createNewFile(drive, body, displayName, parentID);
    });
}
exports.default = uploadFileToDrive;
/**
 * ファイルを新規作成
 * @param drive GoogleDriveインスタンス
 * @param body アップロードするファイルの内容
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 */
function createNewFile(drive, body, displayName, parentID) {
    return __awaiter(this, void 0, void 0, function* () {
        const parents = parentID ? [parentID] : undefined;
        const response = yield drive.files.create({
            requestBody: {
                parents: parents,
                name: displayName
            },
            media: {
                body: body
            }
        });
        return response;
    });
}
/**
 * 既存ファイルを更新
 * @param drive GoogleDriveインスタンス
 * @param fileID ファイルID
 * @param body 更新するファイルの内容
 */
function updateExistingFile(drive, fileID, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield drive.files.update({
            fileId: fileID,
            media: {
                body: body
            }
        });
        return response;
    });
}
/**
 * ファイルの表示名からIDを求める
 * @param drive GoogleDriveインスタンス
 * @param displayName 表示名
 * @param parentID 親フォルダのID
 */
function queryFileIDByName(drive, displayName, parentID) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `name = '${displayName}'` + (parentID !== undefined ? ` and '${parentID}' in parents` : "");
        const response = yield drive.files.list({
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: query
        });
        const files = response.data.files;
        const idLists = files === null || files === void 0 ? void 0 : files.flatMap((file) => { var _a; return (_a = file.id) !== null && _a !== void 0 ? _a : []; });
        return idLists !== null && idLists !== void 0 ? idLists : [];
    });
}
//# sourceMappingURL=upload.js.map