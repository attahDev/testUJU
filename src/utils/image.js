const MAX_EDGE = 2400;
const SKIP_BELOW_BYTES = 900 * 1024;

function loadBitmap(file) {
  // 'from-image' applies the photo's EXIF rotation, so phone photos do not come out sideways.
  return createImageBitmap(file, { imageOrientation: 'from-image' });
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Camera photos are often 6 to 15 MB, far more than a web page needs and over the upload limit.
 * Scale the long edge down to 2400px and re-encode (WebP where supported, else JPEG). If anything about
 * that fails, the original file is returned unchanged so an upload is never blocked by the shrinking.
 */
export async function prepareImage(file) {
  try {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
    const bitmap = await loadBitmap(file);
    const longEdge = Math.max(bitmap.width, bitmap.height);
    if (longEdge <= MAX_EDGE && file.size <= SKIP_BELOW_BYTES) {
      bitmap.close();
      return file;
    }
    const scale = Math.min(1, MAX_EDGE / longEdge);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let blob = await toBlob(canvas, 'image/webp', 0.86);
    if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', 0.88);
    if (!blob || blob.size >= file.size) return file; // never make it bigger
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
    return new File([blob], `${base}.${ext}`, { type: blob.type });
  } catch {
    return file;
  }
}
