import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #0A0A0A;
    --ink: #FF5C00;
    --amber: #FF5C00;
    --amber-light: #FF8040;
    --amber-pale: #1A0D00;
    --stone: #666666;
    --stone-light: #2A2A2A;
    --white: #111111;
    --text-primary: #FFFFFF;
    --text-secondary: #999999;
    --border: #222222;
    --border-accent: #FF5C00;
  }

  .app-root {
    min-height: 100vh;
    background: #0A0A0A;
    font-family: 'Cabinet Grotesk', sans-serif;
    color: #FFFFFF;
    position: relative;
    overflow-x: hidden;
  }

  /* Subtle noise texture overlay */
  .app-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
    z-index: 1;
  }

  /* ─── HEADER ─── */
  .header {
    padding: 52px 0 40px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid #222222;
    margin-bottom: 64px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-left { display: flex; align-items: center; gap: 20px; }

  .logo-mark {
    width: 52px; height: 52px;
    background: #FF5C00;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 32px rgba(255,92,0,0.35);
  }

  .logo-mark svg { color: #FFFFFF; }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1.1;
    color: #FFFFFF;
  }

  .header-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #666666;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .header-badge {
    display: flex; align-items: center; gap: 8px;
    background: #1A0A00;
    border: 1px solid #FF5C00;
    border-radius: 100px;
    padding: 8px 18px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #FF8040;
    letter-spacing: 0.08em;
    font-weight: 500;
    white-space: nowrap;
  }

  .badge-dot {
    width: 7px; height: 7px;
    background: #FF5C00;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* ─── SECTION LABELS ─── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #FF5C00;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #222222;
  }

  /* ─── SIZE SELECTOR ─── */
  .size-panel {
    background: #111111;
    border: 1px solid #222222;
    border-radius: 28px;
    padding: 40px;
    margin-bottom: 32px;
  }

  .size-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }

  @media (max-width: 640px) {
    .size-grid { grid-template-columns: repeat(3, 1fr); }
    .header { padding: 32px 0 28px; margin-bottom: 40px; }
    .size-panel { padding: 28px 20px; }
    .upload-area { padding: 48px 20px; }
    .results-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr; }
    .action-row { flex-direction: column; }
  }

  .size-btn {
    background: #0A0A0A;
    border: 1.5px solid #2A2A2A;
    border-radius: 14px;
    padding: 16px 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
    font-size: 13px;
    color: #555555;
    transition: all 0.2s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .size-btn:hover {
    border-color: #FF5C00;
    color: #FF5C00;
    background: #1A0A00;
    transform: translateY(-2px);
  }

  .size-btn.active {
    background: #FF5C00;
    border-color: #FF5C00;
    color: #FFFFFF;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(255,92,0,0.35);
  }

  .size-btn.active .size-unit { color: rgba(255,255,255,0.7); }

  .size-val { font-size: 16px; font-weight: 700; display: block; }
  .size-unit { font-size: 10px; letter-spacing: 0.1em; display: block; margin-top: 1px; }

  .custom-row {
    display: flex;
    align-items: center;
    gap: 0;
    background: #0A0A0A;
    border: 1.5px solid #2A2A2A;
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .custom-row:focus-within { border-color: #FF5C00; }

  .custom-row label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555555;
    padding: 0 18px;
    white-space: nowrap;
    border-right: 1px solid #2A2A2A;
    height: 52px;
    display: flex; align-items: center;
  }

  .custom-row input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0 18px;
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    font-weight: 500;
    color: #FFFFFF;
    outline: none;
    height: 52px;
  }

  .custom-row input::placeholder { color: #333333; }

  .target-display {
    padding: 0 20px;
    height: 52px;
    display: flex; align-items: center;
    background: #FF5C00;
    color: #FFFFFF;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.04em;
    border-left: 1px solid rgba(255,255,255,0.15);
  }

  /* ─── UPLOAD AREA ─── */
  .upload-area {
    border: 1.5px dashed #2A2A2A;
    border-radius: 28px;
    padding: 80px 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #111111;
    position: relative;
    overflow: hidden;
  }

  .upload-area::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(255,92,0,0.08) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .upload-area:hover::before { opacity: 1; }
  .upload-area:hover { border-color: #FF5C00; transform: translateY(-2px); box-shadow: 0 16px 48px rgba(255,92,0,0.1); }

  .upload-icon-wrap {
    width: 72px; height: 72px;
    margin: 0 auto 28px;
    background: #1A1A1A;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid #2A2A2A;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .upload-icon-wrap svg { color: #555555; transition: color 0.3s; }

  .upload-area:hover .upload-icon-wrap {
    background: #FF5C00;
    border-color: #FF5C00;
    transform: scale(1.08) rotate(-3deg);
    box-shadow: 0 8px 24px rgba(255,92,0,0.4);
  }

  .upload-area:hover .upload-icon-wrap svg { color: #FFFFFF; }

  .upload-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 700;
    margin-bottom: 10px;
    position: relative; z-index: 1;
    color: #FFFFFF;
  }

  .upload-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #555555;
    letter-spacing: 0.1em;
    position: relative; z-index: 1;
  }

  .upload-formats {
    display: inline-flex; gap: 8px; margin-top: 20px; position: relative; z-index: 1;
  }

  .format-pill {
    background: #1A1A1A;
    border: 1px solid #2A2A2A;
    border-radius: 100px;
    padding: 4px 12px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #555555;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ─── LOADING STATE ─── */
  .loading-card {
    background: #111111;
    border: 1px solid #222222;
    border-radius: 28px;
    padding: 64px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .loading-card::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255,92,0,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: breathe 2.5s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  }

  .loading-spinner {
    width: 56px; height: 56px;
    border: 2px solid #222222;
    border-top-color: #FF5C00;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 28px;
    position: relative; z-index: 1;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #FFFFFF;
    margin-bottom: 8px;
    position: relative; z-index: 1;
  }

  .loading-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #444444;
    letter-spacing: 0.12em;
    position: relative; z-index: 1;
  }

  /* ─── RESULTS ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .results-wrap { animation: fadeUp 0.6s ease forwards; }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .image-card {
    background: var(--white);
    border: 1px solid var(--stone-light);
    border-radius: 24px;
    overflow: hidden;
  }

  .image-card.featured {
    border-color: var(--amber);
    box-shadow: 0 0 0 1px var(--amber), 0 20px 60px rgba(200,135,58,0.12);
  }

  .card-header {
    padding: 16px 22px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--stone-light);
  }

  .card-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--stone);
    display: flex; align-items: center; gap: 6px;
  }

  .card-label-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--stone-light);
  }

  .card-label-dot.active { background: var(--amber); }

  .card-size-pill {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 100px;
    background: var(--cream);
    color: var(--ink);
    border: 1px solid var(--stone-light);
  }

  .card-size-pill.featured {
    background: var(--amber);
    color: var(--white);
    border-color: var(--amber);
  }

  .image-preview {
    aspect-ratio: 4/3;
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .image-preview img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 16px;
  }

  .original-img { filter: grayscale(60%); transition: filter 0.5s; }
  .original-img:hover { filter: grayscale(0%); }

  .card-footer {
    padding: 12px 22px;
    background: var(--cream);
    border-top: 1px solid var(--stone-light);
    display: flex; align-items: center; justify-content: space-between;
  }

  .card-meta {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--stone);
    letter-spacing: 0.08em;
  }

  /* ─── STATUS BANNER ─── */
  .status-banner {
    border-radius: 24px;
    padding: 32px 36px;
    display: flex; align-items: center; gap: 24px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .status-banner.success {
    background: var(--ink);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .status-banner.warning {
    background: var(--amber-pale);
    border: 1px solid #E8C98A;
  }

  .status-icon {
    width: 52px; height: 52px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .status-icon.success { background: var(--amber); }
  .status-icon.warning { background: rgba(200,135,58,0.2); }

  .status-text-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(16px, 2.5vw, 20px);
    color: var(--white);
    margin-bottom: 4px;
  }

  .status-text-title.warning { color: var(--ink); }

  .status-text-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.06em;
  }

  .status-text-sub.warning { color: var(--stone); }

  /* ─── STATS ROW ─── */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .stats-row .stat-card:last-child { grid-column: 1 / -1; }
  }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--stone-light);
    border-radius: 20px;
    padding: 24px;
    display: flex; flex-direction: column; align-items: flex-start;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--stone);
    margin-bottom: 10px;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
  }

  .stat-unit {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--stone);
    margin-top: 4px;
  }

  .stat-accent { color: var(--amber); }

  /* ─── ACTION ROW ─── */
  .action-row {
    display: flex;
    gap: 14px;
  }

  .btn-download {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    background: var(--ink);
    color: var(--white);
    border: none;
    border-radius: 18px;
    padding: 20px 32px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }

  .btn-download:hover {
    background: var(--amber);
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(200,135,58,0.3);
  }

  .btn-reset {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: var(--white);
    color: var(--ink);
    border: 1.5px solid var(--stone-light);
    border-radius: 18px;
    padding: 20px 28px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .btn-reset:hover {
    border-color: var(--ink);
    background: var(--cream);
    transform: translateY(-1px);
  }

  /* ─── FOOTER ─── */
  .footer {
    margin-top: 60px;
    padding: 32px 0;
    border-top: 1px solid var(--stone-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-note {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--stone);
    letter-spacing: 0.1em;
    max-width: 480px;
    line-height: 1.8;
  }

  .footer-note strong { color: var(--ink); font-weight: 500; }

  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    color: var(--stone);
    letter-spacing: 0.04em;
  }
`;

function IconUpload({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconImage({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconZap({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconAlert({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconDownload({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

export default function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [targetSize, setTargetSize] = useState(150);
  const [customSize, setCustomSize] = useState("");
  const fileInputRef = useRef(null);

  const sizeOptions = [50, 100, 150, 200, 300, 500];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setOriginalImage({
      file,
      url: URL.createObjectURL(file),
      sizeInKB: (file.size / 1024).toFixed(1),
      name: file.name,
    });
    compressTheImage(file);
  };

  const compressTheImage = (imageFile) => {
    setIsCompressing(true);
    setCompressedImage(null);
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, image.width, image.height);
      let quality = 0.95;
      let attempts = 0;
      const tryCompress = () => {
        attempts++;
        canvas.toBlob(
          (blob) => {
            const kb = blob.size / 1024;
            if (kb > targetSize && quality > 0.1 && attempts < 50) {
              const ratio = kb / targetSize;
              quality -= ratio > 2 ? 0.1 : ratio > 1.5 ? 0.05 : 0.02;
              tryCompress();
            } else {
              setCompressedImage({
                blob,
                url: URL.createObjectURL(blob),
                sizeInKB: kb.toFixed(1),
                width: image.width,
                height: image.height,
                quality: (quality * 100).toFixed(0),
              });
              setIsCompressing(false);
            }
          },
          "image/jpeg",
          quality,
        );
      };
      tryCompress();
    };
  };

  const reset = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCustomSize = (e) => {
    const v = e.target.value;
    setCustomSize(v);
    if (v && !isNaN(v) && v > 0) setTargetSize(parseInt(v));
  };

  const selectSize = (s) => {
    setTargetSize(s);
    setCustomSize("");
  };

  const savings =
    compressedImage && originalImage
      ? ((1 - compressedImage.sizeInKB / originalImage.sizeInKB) * 100).toFixed(
          0,
        )
      : 0;

  const belowTarget =
    compressedImage && parseFloat(compressedImage.sizeInKB) <= targetSize;

  return (
    <>
      <style>{styles}</style>
      <div className="app-root">
        <div className="container">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <div className="logo-mark">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E8A857"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <div className="header-title">UnclePower Compressor</div>
                <div className="header-subtitle">
                  Professional Compression Studio
                </div>
              </div>
            </div>
            <div className="header-badge">
              <span className="badge-dot" />
              Resolution Preserved
            </div>
          </header>

          {/* Size Selector */}
          <div className="size-panel">
            <div className="section-label">01 — Set Target Size</div>
            <div className="size-grid">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  className={`size-btn${targetSize === s && !customSize ? " active" : ""}`}
                  onClick={() => selectSize(s)}
                >
                  <span className="size-val">{s}</span>
                  <span className="size-unit">KB</span>
                </button>
              ))}
            </div>
            <div className="custom-row">
              <label htmlFor="custom-kb">Custom</label>
              <input
                id="custom-kb"
                type="number"
                value={customSize}
                onChange={handleCustomSize}
                placeholder="Enter KB amount..."
                min="1"
              />
              <div className="target-display">→ {targetSize} KB</div>
            </div>
          </div>

          {/* Upload */}
          {!originalImage && (
            <>
              <div className="section-label" style={{ marginBottom: 16 }}>
                02 — Upload Image
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="file-in"
                onChange={handleImageUpload}
              />
              <label htmlFor="file-in">
                <div className="upload-area">
                  <div className="upload-icon-wrap">
                    <IconUpload size={28} />
                  </div>
                  <div className="upload-title">Drop your image here</div>
                  <div className="upload-sub">
                    or click anywhere to browse files
                  </div>
                  <div className="upload-formats">
                    <span className="format-pill">JPG</span>
                    <span className="format-pill">PNG</span>
                    <span className="format-pill">WebP</span>
                    <span className="format-pill">AVIF</span>
                  </div>
                </div>
              </label>
            </>
          )}

          {/* Loading */}
          {isCompressing && (
            <div className="loading-card">
              <div className="loading-spinner" />
              <div className="loading-title">
                Optimizing to {targetSize} KB…
              </div>
              <div className="loading-sub" style={{ marginTop: 8 }}>
                Adjusting compression quality iteratively
              </div>
            </div>
          )}

          {/* Results */}
          {originalImage && compressedImage && !isCompressing && (
            <div className="results-wrap">
              <div className="section-label" style={{ marginBottom: 20 }}>
                03 — Results
              </div>

              {/* Image Comparison */}
              <div className="results-grid">
                <div className="image-card">
                  <div className="card-header">
                    <div className="card-label">
                      <span className="card-label-dot" />
                      Original
                    </div>
                    <span className="card-size-pill">
                      {originalImage.sizeInKB} KB
                    </span>
                  </div>
                  <div className="image-preview">
                    <img
                      src={originalImage.url}
                      alt="Original"
                      className="original-img"
                    />
                  </div>
                  <div className="card-footer">
                    <span className="card-meta">Hover to view in color</span>
                  </div>
                </div>

                <div className="image-card featured">
                  <div className="card-header">
                    <div className="card-label">
                      <span className="card-label-dot active" />
                      Compressed
                    </div>
                    <span className="card-size-pill featured">
                      {compressedImage.sizeInKB} KB
                    </span>
                  </div>
                  <div className="image-preview">
                    <img src={compressedImage.url} alt="Compressed" />
                  </div>
                  <div className="card-footer">
                    <span className="card-meta">
                      {compressedImage.width} × {compressedImage.height}px
                    </span>
                    <span className="card-meta">
                      Q{compressedImage.quality}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`status-banner ${belowTarget ? "success" : "warning"}`}
              >
                <div
                  className={`status-icon ${belowTarget ? "success" : "warning"}`}
                >
                  {belowTarget ? (
                    <IconZap size={22} />
                  ) : (
                    <IconAlert size={22} />
                  )}
                </div>
                <div>
                  <div
                    className={`status-text-title ${belowTarget ? "" : "warning"}`}
                  >
                    {belowTarget
                      ? `${(targetSize - parseFloat(compressedImage.sizeInKB)).toFixed(1)} KB under target — compression complete`
                      : "Minimum quality reached — cannot compress further"}
                  </div>
                  <div
                    className={`status-text-sub ${belowTarget ? "" : "warning"}`}
                  >
                    {belowTarget
                      ? `Target was ${targetSize} KB · Final size is ${compressedImage.sizeInKB} KB · ${savings}% reduction`
                      : `Image compressed to ${compressedImage.sizeInKB} KB — the smallest possible without severe quality loss`}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-label">Reduction</div>
                  <div className="stat-value">
                    <span className="stat-accent">{savings}</span>%
                  </div>
                  <div className="stat-unit">Smaller than source</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Original Size</div>
                  <div className="stat-value">{originalImage.sizeInKB}</div>
                  <div className="stat-unit">Kilobytes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Final Size</div>
                  <div className="stat-value">
                    <span className="stat-accent">
                      {compressedImage.sizeInKB}
                    </span>
                  </div>
                  <div className="stat-unit">
                    Kilobytes · Quality {compressedImage.quality}%
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="action-row">
                <a
                  href={compressedImage.url}
                  download="compressed-image.jpg"
                  className="btn-download"
                >
                  <IconDownload size={18} />
                  Download Compressed Image
                </a>
                <button className="btn-reset" onClick={reset}>
                  <IconRefresh size={16} />
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            <p className="footer-note">
              Processing happens <strong>entirely in your browser</strong>. No
              files are uploaded to any server. Resolution is always preserved —
              only JPEG compression quality is adjusted.
            </p>
            <span className="footer-logo">Compression Studio</span>
          </footer>
        </div>
      </div>
    </>
  );
}
