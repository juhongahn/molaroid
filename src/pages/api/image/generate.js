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

  pythonProcess.on('exit', (code) => {
    const inputImagePath = postDirName + '/input.jpg';
    const outputAudioPath = postDirName + '/output.mp3';
    const outputTextPath = postDirName + '/output.txt';
    try {
      const imageData = fs.readFileSync(inputImagePath);
      const audioData = fs.readFileSync(outputAudioPath);
      const textData = fs.readFileSync(outputTextPath, 'utf-8');

      const response = {
        image: imageData.toString('base64'),
        audio: audioData.toString('base64'),
        text: textData,
      };
      res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ error: '데이터 처리중 문제가 발생했습니다.' });
    }
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});
  
}
