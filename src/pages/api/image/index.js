import fs from 'fs';
import path from 'path';

const postsDir = '/home/opc/moraloid/posts';
export default function handler(req, res) {
    let files = [];

    const dirs = fs.readdirSync(postsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    if (dirs.length > 0) {
        dirs.forEach((dir) => {
            const dirPath = path.join(postsDir, dir);

            const inputImagePath = dirPath + '/input.jpg';
            const outputAudioPath = dirPath + '/output.mp3';
            const outputTextPath = dirPath + '/output.txt';
            
            const imageData = fs.readFileSync(inputImagePath);
            const audioData = fs.readFileSync(outputAudioPath);
            const textData = fs.readFileSync(outputTextPath, 'utf-8');
        
            const multiFileObj = {
                image: imageData.toString('base64'),
                audio: audioData.toString('base64'),
                text: textData,
            };
            files.push(multiFileObj);
        });
    }
     
    const filesJson = JSON.stringify(files);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=3600');
    res.end(filesJson);
}
