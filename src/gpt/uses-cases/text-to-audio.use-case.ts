import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, voice } = options;

  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] ?? 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios');

  const speehFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, {
    recursive: true,
  });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  console.log(mp3);

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: 'system',
  //       content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
  //     },
  //   ],
  //   model: 'deepseek-chat',
  //   temperature: 0.2,
  // });

  // console.log(completion);

  return {
    prompt: prompt,
    selectedVoice: selectedVoice,
  };
};
