import multer from 'multer';
import fs from 'fs';
import {spawn} from 'child_process'


// Unexpected end of form 방지.
export const config = {
    api: {
      bodyParser: false
    }
  }
let postDirName;
// multer 미들웨어 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // 이미지를 저장할 경로 지정
      const postsDir = '/home/opc/moraloid/posts';
      let dirNum = 1;
      // 폴더의 마지막 숫자를 찾음
      while (fs.existsSync(`${postsDir}/${dirNum}`)) {
        dirNum++;
      }
      // 마지막 숫자보다 1 큰 경로를 만듦
      const newDir = `${postsDir}/${dirNum}`;
      postDirName = newDir;
      fs.mkdirSync(newDir);
      cb(null, newDir);
    },
    filename: function (req, file, cb) {
      cb(null, 'input.jpg');
    }
});
  
const upload = multer({ storage: storage });

export default async function handler(req, res) {
    
    await new Promise((resolve, reject) => {
        upload.single('image')(req, res, function (err) {
          if (err) {
            console.log(err.message)
            res.status(400).json({ error: err.message });
            reject(err);
            return;
          }
          resolve();
        });
    });

  // Python 파일 실행
  const pythonProcess = spawn('python', ['/home/opc/moraloid/server/moraloidCore.py']);

  // 자식 프로세스가 끝나면 콜백 호출
  pythonProcess.on('exit', (code) => {
    
    const boundary = 'myboundary';
    res.setHeader('Content-Type', `multipart/mixed; boundary="${boundary}"`);
    const postsDir = '/home/opc/moraloid/posts_test/1';
    const inputImagePath = postsDir + '/input.jpg';
    const outputAudioPath = postsDir + '/output.midi';
    const outputTextPath = postsDir + '/output.txt';
    outputAudioPath
    Promise.all([
      fs.promises.readFile(inputImagePath),
      fs.promises.readFile(outputTextPath),
      fs.promises.readFile(outputAudioPath),
    ]).then(([inputImage, outputText, outputAudio]) => {
      const responseBody = [
        'Content-Type: image/jpeg',
        '',
        inputImage,
        `--${boundary}`,
        'Content-Type: audio/mpeg',
        '',
        outputAudio,
        `--${boundary}`,
        'Content-Type: text/plain',
        '',
        outputText,
        `--${boundary}--`
      ].join('\r\n');

      res.status(200).end(responseBody);
    }).catch((err) => {
      console.error(err);
      res.statusCode = 500;
      res.end();
    });
  })
  pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });
  pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
  });

  
  
  
}
