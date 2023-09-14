#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// GoogleDriveにファイルをアップロードする
//
const google = __importStar(require("googleapis"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const upload_1 = __importDefault(require("./upload"));
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // コマンドライン引数のパース
        const args = yargs_1.default
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
        const filePath = args.path;
        const fileName = ((_a = args.name) !== null && _a !== void 0 ? _a : "").length > 0 ? args.name : path.basename(filePath);
        const parentID = args.parent;
        // GoogleDrive APIの準備
        const auth = new google.Auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const drive = new google.drive_v3.Drive({ auth: auth });
        // アップロードして結果を表示
        try {
            const response = yield (0, upload_1.default)(drive, fs.createReadStream(filePath), fileName, parentID, true);
            const fileInfo = response.data;
            console.log(`${fileName} was uploaded to google drive. (id: ${fileInfo.id})`);
        }
        catch (error) {
            console.error(`Failed to upload file: ${error.message}`);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=cli.js.map