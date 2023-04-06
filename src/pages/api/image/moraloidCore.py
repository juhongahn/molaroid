# -*- coding: utf-8 -*-

from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from PIL import Image
from samplings import top_p_sampling, temperature_sampling
from music21 import *
import os

baseDir = "/home/opc/moraloid/posts/"
imgFileName="input.jpg"
musicFileName="output.midi"

# 이미지 캡셔닝
def imageCaptioning(image_paths):
  model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
  feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
  tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  model.to(device)

  max_length = 16
  num_beams = 4
  gen_kwargs = {"max_length": max_length, "num_beams": num_beams}
  images = []
  for image_path in image_paths:
    i_image = Image.open(image_path)
    if i_image.mode != "RGB":
      i_image = i_image.convert(mode="RGB")

    images.append(i_image)

  pixel_values = feature_extractor(images=images, return_tensors="pt").pixel_values
  pixel_values = pixel_values.to(device)

  output_ids = model.generate(pixel_values, **gen_kwargs)

  preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
  preds = [pred.strip() for pred in preds]
  return preds


# 텍스트 gen
def genText(text, outputPath):
  englishText = text
  koreanText = "안녕 한국어 텍스트야"



  # TODO: englishText와 koreanText를 넣어주세요
  # englishText: 음악생성을 위한 풍부한 텍스트(200 characters 미만)
  # koreanText: 게시글에 표시될 풍부한 텍스트




  # koreanText 내용을 파일로 저장하는 saveText 함수 정의
  def saveText(content, filePath):
        with open(filePath, 'w', encoding='utf-8') as f:
            f.write(content)

  # koreanText 내용을 outputPath 파일로 저장
  saveText(koreanText, outputPath)

  return englishText

# 텍스트기반 음악생성
def textToMusic(text, outputPath):
  tokenizer = AutoTokenizer.from_pretrained('sander-wood/text-to-music')
  model = AutoModelForSeq2SeqLM.from_pretrained('sander-wood/text-to-music')
  model = model

  max_length = 1024
  top_p = 1.0
  temperature = 1.0

  input_ids = tokenizer(text, 
                        return_tensors='pt', 
                        truncation=True, 
                        max_length=max_length)['input_ids']
  decoder_start_token_id = model.config.decoder_start_token_id
  eos_token_id = model.config.eos_token_id
  decoder_input_ids = torch.tensor([[decoder_start_token_id]])

  for t_idx in range(max_length):
      outputs = model(input_ids=input_ids, 
      decoder_input_ids=decoder_input_ids)
      probs = outputs.logits[0][-1]
      probs = torch.nn.Softmax(dim=-1)(probs).detach().numpy()
      sampled_id = temperature_sampling(probs=top_p_sampling(probs, 
                                                            top_p=top_p, 
                                                            return_probs=True),
                                        temperature=temperature)
      decoder_input_ids = torch.cat((decoder_input_ids, torch.tensor([[sampled_id]])), 1)
      if sampled_id!=eos_token_id:
          continue
      else:
          tune = "X:1\n"
          tune += tokenizer.decode(decoder_input_ids[0], skip_special_tokens=True)
          
          # Create a music21 stream object from the ABC notation
          stream = converter.parse(tune, format='abc')

          # Save the stream as an midi file
          stream.write('midi', fp = outputPath)

          break

def getLastNumDir(path):
    lastNum = None
    for folder in os.listdir(path):
        folderPath = os.path.join(path, folder)
        if os.path.isdir(folderPath) and folder.isdigit():
            lastNum = folderPath
    return lastNum

#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    실행    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

lastNumDir = getLastNumDir(baseDir)
inputJpgPath = os.path.join(lastNumDir, "input.jpg")
outputMusicPath = os.path.join(lastNumDir, "output.midi")
outputTextPath = os.path.join(lastNumDir, "output.txt")

print(inputJpgPath)
print(outputMusicPath)
print(outputTextPath)
resultCaptioning = imageCaptioning([inputJpgPath])
print(resultCaptioning)

resultGenText = genText(resultCaptioning, outputTextPath)

textToMusic(resultGenText, outputMusicPath)