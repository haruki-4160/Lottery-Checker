import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Zap, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { recognizeTicketImage, preprocessImageForOcr } from '../utils/ocr';

interface CameraScannerProps {
  onTicketDetected: (data: { series?: string; number?: string; drawCode?: string }) => void;
  onClose: () => void;
  lang: 'en' | 'ml';
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onTicketDetected,
  onClose,
  lang,
}) => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [detectedPreview, setDetectedPreview] = useState<{ series?: string; number?: string } | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Initialize camera list
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back / environment camera
          const backCam = devices.find(
            (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setErrorMsg(
            lang === 'en'
              ? 'No camera found on this device.'
              : 'ക്യാമറ ലഭ്യമായില്ല.'
          );
        }
      })
      .catch((err) => {
        setErrorMsg(
          lang === 'en'
            ? 'Camera permission denied or camera unavailable.'
            : 'ക്യാമറ അനുമതി ലഭിച്ചില്ല.'
        );
        console.error('Camera error:', err);
      });

    return () => {
      stopScanner();
    };
  }, [lang]);

  // Start scanner when camera is selected
  useEffect(() => {
    if (selectedCameraId) {
      startScanner(selectedCameraId);
    }
  }, [selectedCameraId]);

  const startScanner = async (cameraId: string) => {
    try {
      if (html5QrCodeRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode('qr-reader-target');
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 160 },
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          // Barcode or QR code decoded
          handleBarcodeDecoded(decodedText);
        },
        () => {
          // Frame error / not detected, ignore
        }
      );

      setIsScanning(true);
      setErrorMsg('');
    } catch (err: any) {
      console.error('Failed to start scanner:', err);
      setErrorMsg(
        lang === 'en'
          ? 'Unable to open camera stream. Please allow camera permissions.'
          : 'ക്യാമറ ആരംഭിക്കാൻ സാധിച്ചില്ല. അനുമതി പരിശോധിക്കുക.'
      );
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping scanner:', e);
      }
    }
    setIsScanning(false);
  };

  const handleBarcodeDecoded = (rawText: string) => {
    // Check if barcode encoded ticket details directly
    const clean = rawText.toUpperCase().trim();
    const match = clean.match(/\b([A-Z]{2})\s*[-:]?\s*([0-9]{6})\b/);
    if (match) {
      setDetectedPreview({ series: match[1], number: match[2] });
      onTicketDetected({ series: match[1], number: match[2] });
    }
  };

  // OCR Snapshot: Grab frame from video and recognize text
  const handleCaptureFrameForOcr = async () => {
    const videoEl = document.querySelector('#qr-reader-target video') as HTMLVideoElement;
    if (!videoEl) {
      setErrorMsg(lang === 'en' ? 'Camera stream is not active.' : 'ക്യാമറ പ്രവർത്തിക്കുന്നില്ല.');
      return;
    }

    setIsProcessingOcr(true);
    setOcrStatus(lang === 'en' ? 'Enhancing ticket image...' : 'ചിത്രം ക്രമീകരിക്കുന്നു...');

    try {
      const processedDataUrl = preprocessImageForOcr(videoEl);
      setOcrStatus(lang === 'en' ? 'Recognizing ticket digits...' : 'അക്ഷരങ്ങളും സംഖ്യകളും വായിക്കുന്നു...');

      const extracted = await recognizeTicketImage(processedDataUrl, (status, progress) => {
        setOcrStatus(`${status} (${Math.round(progress * 100)}%)`);
      });

      if (extracted.series && extracted.number) {
        setDetectedPreview({ series: extracted.series, number: extracted.number });
        onTicketDetected(extracted);
      } else if (extracted.number) {
        setDetectedPreview({ series: extracted.series || 'WA', number: extracted.number });
        onTicketDetected({ series: extracted.series || 'WA', number: extracted.number });
      } else {
        setErrorMsg(
          lang === 'en'
            ? 'Could not clearly detect Series & 6-digit Number. Hold the ticket steady under good light or enter manually.'
            : 'ടിക്കറ്റ് നമ്പർ വ്യക്തമായി വായിക്കാൻ കഴിഞ്ഞില്ല. നല്ല വെളിച്ചത്തിൽ പിടിക്കുക.'
        );
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setErrorMsg(
        lang === 'en'
          ? 'Error processing ticket image. Please try again or type manually.'
          : 'സ്കാൻ ചെയ്യുമ്പോൾ പിഴവ് സംഭവിച്ചു.'
      );
    } finally {
      setIsProcessingOcr(false);
      setOcrStatus('');
    }
  };

  const toggleCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCameraId(cameras[nextIndex].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              {lang === 'en' ? 'Live Ticket Scanner' : 'ലൈവ് ടിക്കറ്റ് സ്കാനർ'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {cameras.length > 1 && (
              <button
                onClick={toggleCamera}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="relative bg-black w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
          {/* Target Element for html5-qrcode */}
          <div id="qr-reader-target" className="w-full h-full object-cover"></div>

          {/* Viewfinder Target Overlays */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="relative w-64 sm:w-72 h-36 sm:h-40 border-2 border-dashed border-amber-400/70 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              {/* Laser animation */}
              <div className="laser-line"></div>

              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

              <span className="text-[11px] bg-slate-900/80 px-2 py-1 rounded text-amber-300 font-semibold tracking-wider uppercase backdrop-blur-sm">
                {lang === 'en' ? 'Align Series & 6 Digits' : 'സീരീസും നമ്പറും ഇവിടെ വെയ്ക്കുക'}
              </span>
            </div>
          </div>

          {/* OCR Processing Overlay */}
          {isProcessingOcr && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 z-20">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-amber-300 text-center animate-pulse">
                {ocrStatus || (lang === 'en' ? 'Scanning...' : 'സ്കാൻ ചെയ്യുന്നു...')}
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="px-4 py-2 bg-rose-950/40 border-t border-rose-800/50 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* Detection Preview Confirmation */}
        {detectedPreview && (
          <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle className="w-4 h-4" />
              <span>
                {lang === 'en' ? 'Detected:' : 'കണ്ടെത്തിയത്:'} <strong>{detectedPreview.series || '??'} {detectedPreview.number}</strong>
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
            >
              {lang === 'en' ? 'Apply' : 'ഉപയോഗിക്കുക'}
            </button>
          </div>
        )}

        {/* Bottom Scanner Controls */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={handleCaptureFrameForOcr}
            disabled={isProcessingOcr || !isScanning}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {isProcessingOcr
                ? (lang === 'en' ? 'Processing...' : 'പ്രോസസ്സ് ചെയ്യുന്നു...')
                : (lang === 'en' ? 'Instant OCR Scan' : 'തത്സമയം സ്കാൻ ചെയ്യുക')}
            </span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            {lang === 'en' ? 'Cancel' : 'റദ്ദാക്കുക'}
          </button>
        </div>

      </div>
    </div>
  );
};
