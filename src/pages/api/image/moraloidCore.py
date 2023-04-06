# -*- coding: utf-8 -*-

from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from PIL import Image
from samplings import top_p_sampling, temperature_sampling
from music21 import *
import os
import openai
import json

openai.api_key = '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'
baseDir = "/home/opc/moraloid/posts/"
imgFileName="input.jpg"
musicFileName="output.midi"

# content 내용을 파일로 저장하는 saveText 함수 정의
def saveText(content, filePath):
      with open(filePath, 'w', encoding='utf-8') as f:
          f.write(content)

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
def genText(text, outputTextPath, outputJsonPath):
  englishText = text
  koreanText = None

  # 텍스트 완성을 위한 매개변수 설정
  prompt1 = """
      아래 내용 참고해서 좋아요를 많이 받고 사람들의 관심을 끌 수 있도록 인스타그램에 올릴 감성글 스타일로 한글버전, 영문버전으로 json 포맷 텍스트만 줘.
      영문은 'en' key에 대한 value, 한글은 'ko' key에 대한 value에 작성해줘. 
      영문은 최대 200 char 미만으로 작성하고 한글 어미는 최대한 생략해줘.\n
      """
  prompt = prompt1 + str(text)
  max_tokens = 1024
  temperature = 0.7

  # 언어 모델 호출
  response = openai.Completion.create(
      engine="text-davinci-003",
      prompt=prompt,
      max_tokens=max_tokens,
      temperature=temperature,
      n = 1,
      stop=None,
      top_p=1
  )

  if not response.choices:
        raise ValueError("response.choices is empty")

  result =  response.choices[0].text.strip()
  result = result[result.index("{"):result.rindex("}")+1]
  result = result.replace("\n", "")
  saveText(result, outputJsonPath)
  
  dict = json.loads(result)
  englishText = str(dict['en'])
  koreanText = str(dict['ko'])
 
  # koreanText 내용을 outputPath 파일로 저장
  saveText(koreanText, outputTextPath)

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

          # Prepare the stream for MIDI output
          # midi_stream = prepareStreamForMidi(stream)

          # Save the stream as an midi file
          # midi_stream.write('midi', fp=outputPath)
          stream.write('midi', fp=outputPath)
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
outputJsonPath = os.path.join(lastNumDir, "output.json")

print(inputJpgPath)
print(outputMusicPath)
print(outputTextPath)

resultCaptioning = imageCaptioning([inputJpgPath])
print(resultCaptioning)

resultGenText = genText(resultCaptioning, outputTextPath, outputJsonPath)
print(resultGenText)

textToMusic(resultGenText, outputMusicPath)