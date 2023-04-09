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
            try {
                const imageData = fs.readFileSync(inputImagePath);
                const audioData = fs.readFileSync(outputAudioPath);
                const textData = fs.readFileSync(outputTextPath, 'utf-8');

                const multiFileObj = {
                    image: imageData.toString('base64'),
                    audio: audioData.toString('base64'),
                    text: textData,
                };

                files.push(multiFileObj);
            } catch (err) {
                // 파일 없으면 서버 터지는거 막기위해 예외 처리, 없으면 건너뛴다.
                console.error(`해당 폴더에 파일이 없습니다:  ${dirPath}: ${err}`);
            }
     });
    }
    files.reverse();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(files);
}
