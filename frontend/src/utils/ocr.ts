import { createWorker } from 'tesseract.js';

export interface ExtractedTicketData {
  series?: string;
  number?: string;
  drawCode?: string;
  confidence: number;
  rawText: string;
}

/**
 * Preprocesses an image element or canvas for OCR:
 * - Grayscale
 * - High contrast stretch
 * - High-pass thresholding
 */
export function preprocessImageForOcr(
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  cropArea?: { x: number; y: number; width: number; height: number }
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const sw = cropArea ? cropArea.width : ('videoWidth' in source ? source.videoWidth : source.width);
  const sh = cropArea ? cropArea.height : ('videoHeight' in source ? source.videoHeight : source.height);
  const sx = cropArea ? cropArea.x : 0;
  const sy = cropArea ? cropArea.y : 0;

  // Scale up small regions for better OCR fidelity
  const targetWidth = Math.max(800, sw);
  const scale = targetWidth / sw;
  canvas.width = targetWidth;
  canvas.height = sh * scale;

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  // Apply Grayscale & Contrast enhancement
  const contrast = 1.35; // boost contrast
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let adj = factor * (gray - 128) + 128;
    // Binarize
    adj = adj > 140 ? 255 : (adj < 90 ? 0 : adj);
    d[i] = adj;
    d[i + 1] = adj;
    d[i + 2] = adj;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Parses raw OCR text to detect Kerala ticket series, 6-digit number, and draw code.
 */
export function parseTicketText(text: string): { series?: string; number?: string; drawCode?: string } {
  const clean = text.toUpperCase();

  // Draw code detection: e.g. W-780, SS-430, FF-105, KN-520, NR-380, KR-655, BR-99
  const drawMatch = clean.match(/\b(W|SS|FF|KN|NR|KR|BR|TH)[- ]*([0-9]{2,4})\b/);
  const drawCode = drawMatch ? `${drawMatch[1]}-${drawMatch[2]}` : undefined;

  // Standard Kerala ticket: 2 letters followed by 6 digits (e.g. WN 745821, WA 123456, SK 829143)
  // Kerala series uses A-Z except 'I' (WA, WB, WC, WD, WE, WF, WG, WH, WJ, WK, WL, WM, etc.)
  const fullTicketMatch = clean.match(/\b([A-Z]{2})\s*[-:]?\s*([0-9]{6})\b/);
  if (fullTicketMatch) {
    return {
      series: fullTicketMatch[1],
      number: fullTicketMatch[2],
      drawCode
    };
  }

  // Backup: find any 2-letter word followed shortly by 6 consecutive digits
  const backupSeriesMatch = clean.match(/\b([A-Z]{2})\b/);
  const backupNumberMatch = clean.match(/\b([0-9]{6})\b/);

  return {
    series: backupSeriesMatch ? backupSeriesMatch[1] : undefined,
    number: backupNumberMatch ? backupNumberMatch[1] : undefined,
    drawCode
  };
}

let workerInstance: any = null;

export async function recognizeTicketImage(
  imageSource: string | HTMLCanvasElement | HTMLImageElement,
  onProgress?: (status: string, progress: number) => void
): Promise<ExtractedTicketData> {
  if (!workerInstance) {
    onProgress?.('Initializing OCR engine...', 0.1);
    workerInstance = await createWorker('eng');
    // Configure whitelist characters to recognize uppercase letters, numbers, and hyphens
    await workerInstance.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -:\n',
    });
  }

  onProgress?.('Scanning ticket text...', 0.5);
  const ret = await workerInstance.recognize(imageSource);
  const text = ret.data.text;
  const confidence = ret.data.confidence;

  onProgress?.('Extracting ticket series and number...', 0.9);
  const parsed = parseTicketText(text);

  return {
    series: parsed.series,
    number: parsed.number,
    drawCode: parsed.drawCode,
    confidence,
    rawText: text
  };
}
