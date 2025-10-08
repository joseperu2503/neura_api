import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

const fileMimeTypesByExtension = {
  // 🖼️ Imágenes
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',

  // 📄 Documentos
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // 🎧 Audios
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  aac: 'audio/aac',

  // 🎥 Videos (por si lo necesitas)
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
};

interface UploadFileOptions {
  transformToPng?: boolean;
}

export const geminiUploadFiles = async (
  ai: GoogleGenAI,
  files: Express.Multer.File[],
  options: UploadFileOptions = {},
) => {
  const { transformToPng } = options;

  // 🔹 Transformación opcional a PNG solo para imágenes
  if (transformToPng) {
    const pngUploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = await sharp(file.buffer).png().toBuffer();
        return ai.files.upload({
          file: new Blob([new Uint8Array(buffer)], { type: 'image/png' }),
        });
      }),
    );
    return pngUploadedFiles;
  }

  // 🔹 Carga directa (audios, documentos, etc.)
  const uploadedFiles = await Promise.all(
    files.map((file) => {
      const fileExtension =
        file.originalname.split('.').pop()?.toLowerCase() ?? '';
      const fileMimeType =
        fileMimeTypesByExtension[fileExtension] ?? file.mimetype;

      const type = file.mimetype.includes('application/octet-stream')
        ? fileMimeType
        : file.mimetype;

      return ai.files.upload({
        file: new Blob([new Uint8Array(file.buffer)], { type }),
      });
    }),
  );

  return uploadedFiles;
};
