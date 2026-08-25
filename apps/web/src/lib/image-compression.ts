const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function validateAndCompressImages(files: File[]) {
  if (files.length < 1 || files.length > 4) throw new Error('Selecione de 1 a 4 imagens');
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
      throw new Error('Use apenas imagens JPG, PNG ou WebP');
    if (file.size > MAX_FILE_SIZE) throw new Error(`A imagem ${file.name} ultrapassa 5 MB`);
  }
  return Promise.all(files.map(compressImage));
}

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value ? resolve(value) : reject(new Error('Não foi possível comprimir a imagem')),
      'image/webp',
      0.82,
    ),
  );
  if (blob.size > MAX_FILE_SIZE)
    throw new Error(`A imagem ${file.name} permaneceu acima de 5 MB após a compressão`);
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}
