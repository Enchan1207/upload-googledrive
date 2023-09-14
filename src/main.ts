//
//
//
import * as google from 'googleapis';


async function main() {
    const fileName: string = "example.txt";
    const folderID: string = process.env.FOLDER_ID ?? "";

    const auth = new google.Auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = new google.drive_v3.Drive({ auth: auth });
    const response = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        q: `name = '${fileName}' and '${folderID}' in parents`
    });
    const files = response.data.files;
    files?.forEach((file) => {
        console.log(`${file.name} (${file.id})`);
    });
}

main().catch(console.error);
