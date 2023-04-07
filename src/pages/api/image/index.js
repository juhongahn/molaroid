import fs from 'fs';
import path from 'path';

const postsDir = '/home/opc/moraloid/posts';
export default function handler(req, res) {

    let files = [];

    const dirs = fs.readdirSync(postsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    dirs.forEach((dir) => {

        const dirPath = path.join(postsDir, dir);
        const inputImagePath = dirPath + '/input.jpg';

        const imageData = fs.readFileSync(inputImagePath);
        //const textData = fs.readFileSync(outputTextPath, 'utf-8');
    
        const multiFiles = {
            image: imageData.toString('base64'),
        };
        files.push(multiFiles);
    });

     
    const filesJson = JSON.stringify(files);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=3600');
    res.end(filesJson);
}
