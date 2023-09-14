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
// Custom action of GitHub Actions - Upload file to Google Drive
//
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const google = __importStar(require("googleapis"));
const path = __importStar(require("path"));
const upload_1 = __importDefault(require("./upload"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield (0, upload_1.default)(drive, body, displayName, parent, overwrite);
    });
}
main().catch((error) => {
    core.setFailed(error.message);
});
//# sourceMappingURL=main.js.map