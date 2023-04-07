import multer from 'multer';
import fs from 'fs';
import {spawn} from 'child_process'

// Unexpected end of form 방지.
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  const postsDir = '/home/opc/moraloid/posts_test/1';
  const boundary = 'myboundary';
  res.setHeader('Content-Type', `multipart/mixed; boundary="${boundary}"`);

  const inputImagePath = postsDir + '/input.jpg';
  const outputAudioPath = postsDir + '/output.midi';
  const outputTextPath = postsDir + '/output.txt';

  const imageData = fs.readFileSync(inputImagePath);
  const audioData = fs.readFileSync(outputAudioPath);
  const textData = fs.readFileSync(outputTextPath, 'utf-8');

  const response = {
    image: imageData.toString('base64'),
    audio: audioData.toString('base64'),
    text: textData,
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
}
