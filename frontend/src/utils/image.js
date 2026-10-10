// Prepare une image avant envoi : recadrage carre centre, 256 x 256 pixels, format WebP (JPEG si non pris en charge).
// Une photo de plusieurs Mo devient ainsi un fichier d'environ 20 a 40 Ko.
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function resizeImage(file, size = 256) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choisissez une image (JPEG, PNG ou WebP).')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image trop lourde (10 Mo maximum).')
  }

  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  canvas
    .getContext('2d')
    .drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  bitmap.close()

  const webp = canvas.toDataURL('image/webp', 0.85)
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.85)
}
