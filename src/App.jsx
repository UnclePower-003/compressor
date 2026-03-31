import { useState, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #F0F2F7;
      --surface:   #FFFFFF;
      --surface2:  #F7F8FC;
      --surface3:  #EEF0F8;
      --border:    #DDE1EE;
      --border2:   #C8CEDF;
      --text:      #1A1E2E;
      --text2:     #5A6380;
      --text3:     #8B94AD;
      --blue:      #3563E9;
      --blue-lt:   #EBF0FF;
      --blue-dk:   #1D3FA8;
      --teal:      #0EA5A0;
      --teal-lt:   #E6F7F7;
      --green:     #12A150;
      --green-lt:  #E6F7EE;
      --amber:     #D97706;
      --amber-lt:  #FEF3C7;
      --red:       #E02B2B;
      --shadow-sm: 0 1px 3px rgba(30,40,80,0.08), 0 1px 2px rgba(30,40,80,0.05);
      --shadow:    0 4px 16px rgba(30,40,80,0.10), 0 1px 4px rgba(30,40,80,0.06);
      --shadow-lg: 0 12px 40px rgba(30,40,80,0.13), 0 4px 12px rgba(30,40,80,0.08);
      --radius:    18px;
      --radius-sm: 12px;
      --radius-xs: 8px;
    }

    body { background: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }

    .mono { font-family: 'Fira Code', monospace; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--surface3); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

    /* animations */
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.75);} }
    @keyframes shimmer { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
    @keyframes progress { from{width:0;} to{width:var(--prog);} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);} }

    .fade-up  { animation: fadeUp  .5s cubic-bezier(.22,1,.36,1) both; }
    .slide-in { animation: slideIn .4s cubic-bezier(.22,1,.36,1) both; }

    .checker {
      background-image:
        linear-gradient(45deg,#E2E6F0 25%,transparent 25%),
        linear-gradient(-45deg,#E2E6F0 25%,transparent 25%),
        linear-gradient(45deg,transparent 75%,#E2E6F0 75%),
        linear-gradient(-45deg,transparent 75%,#E2E6F0 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0;
      background-color: #F7F8FC;
    }

    .btn-primary {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%);
      color:#fff; border:none; border-radius:var(--radius-sm); padding:14px 28px;
      font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
      cursor:pointer; transition:all .22s ease; text-decoration:none;
      box-shadow: 0 4px 14px rgba(53,99,233,.3);
      letter-spacing:.01em;
    }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(53,99,233,.4); filter:brightness(1.06); }
    .btn-primary:active { transform:translateY(0); }

    .btn-teal {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      background: linear-gradient(135deg, var(--teal) 0%, #077C78 100%);
      color:#fff; border:none; border-radius:var(--radius-sm); padding:14px 28px;
      font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
      cursor:pointer; transition:all .22s ease; text-decoration:none;
      box-shadow: 0 4px 14px rgba(14,165,160,.28);
    }
    .btn-teal:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,165,160,.38); filter:brightness(1.07); }

    .btn-ghost {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      background: var(--surface); color:var(--text2);
      border: 1.5px solid var(--border); border-radius:var(--radius-sm); padding:14px 24px;
      font-family:'Outfit',sans-serif; font-size:14px; font-weight:600;
      cursor:pointer; transition:all .2s ease;
      box-shadow: var(--shadow-sm);
    }
    .btn-ghost:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-lt); transform:translateY(-1px); }

    .btn-next {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      background: linear-gradient(135deg,#F0F2F7 0%,#E4E8F5 100%);
      color:var(--blue); border: 1.5px solid var(--border);
      border-radius:var(--radius-sm); padding:14px 26px;
      font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
      cursor:pointer; transition:all .2s ease;
    }
    .btn-next:hover { background:var(--blue-lt); border-color:var(--blue); transform:translateY(-1px); box-shadow:var(--shadow-sm); }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    .tag {
      display:inline-flex; align-items:center; gap:5px;
      font-family:'Fira Code',monospace; font-size:10px; font-weight:500;
      letter-spacing:.12em; text-transform:uppercase;
      padding:4px 11px; border-radius:99px;
    }

    .section-head {
      display:flex; align-items:center; gap:12px; margin-bottom:24px;
    }
    .section-head-num {
      font-family:'Fira Code',monospace; font-size:10px; letter-spacing:.18em;
      text-transform:uppercase; color:var(--blue); font-weight:500;
      padding:4px 10px; background:var(--blue-lt); border-radius:99px;
    }
    .section-head-label {
      font-size:13px; font-weight:600; color:var(--text2); letter-spacing:.04em; text-transform:uppercase;
    }
    .section-head-line { flex:1; height:1px; background:var(--border); }

    .size-btn {
      background:var(--surface2); border:1.5px solid var(--border);
      border-radius:var(--radius-xs); padding:14px 6px; cursor:pointer;
      font-family:'Fira Code',monospace; text-align:center; color:var(--text3);
      transition:all .18s ease;
    }
    .size-btn:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-lt); transform:translateY(-2px); }
    .size-btn.active { background:linear-gradient(135deg,var(--blue),var(--blue-dk)); border-color:var(--blue); color:#fff; transform:translateY(-3px); box-shadow:0 6px 18px rgba(53,99,233,.3); }

    .upload-zone {
      border: 2px dashed var(--border2);
      border-radius: var(--radius);
      padding: 72px 40px;
      text-align: center;
      cursor: pointer;
      background: var(--surface2);
      transition: all .3s ease;
      position: relative; overflow: hidden;
    }
    .upload-zone:hover { border-color:var(--blue); background:var(--blue-lt); transform:translateY(-2px); box-shadow:var(--shadow); }
    .upload-zone::before {
      content:''; position:absolute; inset:0;
      background: radial-gradient(ellipse at 50% 0%, rgba(53,99,233,.06) 0%, transparent 70%);
      pointer-events:none;
    }

    .stat-card {
      background:var(--surface2); border:1px solid var(--border);
      border-radius:var(--radius-sm); padding:22px 20px;
    }

    .progress-bar-wrap {
      height:6px; background:var(--surface3); border-radius:99px; overflow:hidden;
    }
    .progress-bar {
      height:100%; border-radius:99px;
      background: linear-gradient(90deg, var(--blue) 0%, var(--teal) 100%);
      transition: width .4s ease;
    }

    /* Nav toggle */
    .nav-pill {
      display:flex; background:var(--surface3); border-radius:var(--radius);
      padding:6px; gap:4px; border:1px solid var(--border);
    }
    .nav-pill-btn {
      flex:1; display:flex; align-items:center; justify-content:center; gap:10px;
      padding:14px 32px; border-radius:var(--radius-sm); font-weight:700;
      font-size:14px; cursor:pointer; transition:all .25s cubic-bezier(.22,1,.36,1);
      border:none; font-family:'Outfit',sans-serif;
    }
    .nav-pill-btn.active {
      background:var(--surface);
      color:var(--blue);
      box-shadow: var(--shadow);
    }
    .nav-pill-btn.inactive {
      background:transparent; color:var(--text3);
    }
    .nav-pill-btn.inactive:hover { color:var(--text2); }

    .image-card-featured {
      box-shadow: 0 0 0 2px var(--blue), var(--shadow-lg);
    }

    .shimmer-bg {
      background: linear-gradient(90deg, var(--surface3) 0%, var(--border) 50%, var(--surface3) 100%);
      background-size: 400px 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const Ico = {
  Upload: () => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Download: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Refresh: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Alert: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Image: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Video: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Film: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="2" y1="17" x2="7" y2="17" />
    </svg>
  ),
  Play: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="rgba(53,99,233,0.12)" />
      <polygon points="10 8 16 12 10 16 10 8" fill="var(--blue)" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function SectionHead({ num, label }) {
  return (
    <div className="section-head">
      <span className="section-head-num mono">{num}</span>
      <span className="section-head-label">{label}</span>
      <div className="section-head-line" />
    </div>
  );
}

function fmtSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function fmtDur(s) {
  if (!s || isNaN(s)) return "—";
  const m = Math.floor(s / 60),
    sec = Math.floor(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

/* ─────────────────────────────────────────────
   IMAGE COMPRESSOR PAGE
───────────────────────────────────────────── */
function ImageCompressor({ onSwitchToVideo }) {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [targetKB, setTargetKB] = useState(150);
  const [customKB, setCustomKB] = useState("");
  const fileRef = useRef(null);
  const sizeOpts = [50, 100, 150, 200, 300, 500];

  const doCompress = useCallback((file, tKB) => {
    setCompressing(true);
    setCompressed(null);
    const img = new Image();
    const objURL = URL.createObjectURL(file);
    img.src = objURL;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);

      // detect actual transparency
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let hasAlpha = false;
      for (let i = 3; i < px.length; i += 4) {
        if (px[i] < 255) {
          hasAlpha = true;
          break;
        }
      }

      const fmt = hasAlpha ? "image/png" : "image/jpeg";
      const ext = hasAlpha ? "png" : "jpg";
      let quality = 0.95,
        attempts = 0;

      const loop = () => {
        attempts++;
        canvas.toBlob(
          (blob) => {
            const kb = blob.size / 1024;
            if (kb > tKB && quality > 0.05 && attempts < 60) {
              const r = kb / tKB;
              quality -= r > 2 ? 0.12 : r > 1.5 ? 0.06 : 0.02;
              quality = Math.max(quality, 0.05);
              loop();
            } else {
              setCompressed({
                blob,
                url: URL.createObjectURL(blob),
                sizeKB: kb.toFixed(1),
                width: img.width,
                height: img.height,
                quality: Math.round(quality * 100),
                isAlpha: hasAlpha,
                ext,
              });
              setCompressing(false);
            }
          },
          fmt,
          fmt === "image/jpeg" ? quality : undefined,
        );
      };
      loop();
    };
  }, []);

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isTransp = file.type === "image/png" || file.type === "image/webp";
    setOriginal({
      file,
      url: URL.createObjectURL(file),
      sizeKB: (file.size / 1024).toFixed(1),
      name: file.name,
      isTransp,
    });
    doCompress(file, targetKB);
  };

  const selectSize = (s) => {
    setTargetKB(s);
    setCustomKB("");
  };

  const handleCustom = (e) => {
    const v = e.target.value;
    setCustomKB(v);
    if (v && !isNaN(v) && Number(v) > 0) setTargetKB(parseInt(v));
  };

  const reset = () => {
    setOriginal(null);
    setCompressed(null);
    setCompressing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const compressNext = () => {
    reset();
    setTimeout(() => fileRef.current?.click(), 100);
  };

  const savings =
    compressed && original
      ? Math.max(0, (1 - compressed.sizeKB / original.sizeKB) * 100).toFixed(0)
      : 0;
  const belowTarget = compressed && parseFloat(compressed.sizeKB) <= targetKB;

  return (
    <div>
      {/* Size Selector */}
      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <SectionHead num="01" label="Set Target Size" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          {sizeOpts.map((s) => (
            <button
              key={s}
              className={`size-btn${targetKB === s && !customKB ? " active" : ""}`}
              onClick={() => selectSize(s)}
            >
              <span
                style={{ fontSize: "16px", fontWeight: 700, display: "block" }}
              >
                {s}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: "10px",
                  display: "block",
                  marginTop: "2px",
                  opacity: 0.75,
                }}
              >
                KB
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface2)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-xs)",
            overflow: "hidden",
          }}
        >
          <label
            htmlFor="img-custom"
            className="mono"
            style={{
              fontSize: "10px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--text3)",
              padding: "0 18px",
              borderRight: "1px solid var(--border)",
              height: "50px",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            Custom
          </label>
          <input
            id="img-custom"
            type="number"
            value={customKB}
            onChange={handleCustom}
            placeholder="Enter KB amount…"
            min="1"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              padding: "0 18px",
              fontFamily: "'Fira Code',monospace",
              fontSize: "14px",
              color: "var(--text)",
              outline: "none",
              height: "50px",
            }}
          />
          <div
            className="mono"
            style={{
              padding: "0 20px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(135deg,var(--blue),var(--blue-dk))",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              borderLeft: "1px solid rgba(255,255,255,.15)",
            }}
          >
            → {targetKB} KB
          </div>
        </div>
      </div>

      {/* Upload */}
      {!original && (
        <div className="card" style={{ padding: "32px" }}>
          <SectionHead num="02" label="Upload Image" />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="img-file"
            onChange={onFile}
          />
          <label htmlFor="img-file">
            <div className="upload-zone">
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 24px",
                  background: "var(--surface)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border)",
                  color: "var(--text3)",
                  boxShadow: "var(--shadow-sm)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Ico.Upload />
              </div>
              <div
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "clamp(18px,2.5vw,24px)",
                  fontWeight: 700,
                  marginBottom: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Drop your image here
              </div>
              <div
                className="mono"
                style={{
                  fontSize: "11px",
                  color: "var(--text3)",
                  letterSpacing: ".1em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                or click anywhere to browse files
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {["JPG", "PNG", "WebP", "AVIF"].map((f) => (
                  <span
                    key={f}
                    className="mono"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "99px",
                      padding: "4px 12px",
                      fontSize: "10px",
                      color: "var(--text3)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Loading */}
      {compressing && (
        <div
          className="card"
          style={{ padding: "60px 40px", textAlign: "center" }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              border: "3px solid var(--border)",
              borderTopColor: "var(--blue)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 24px",
            }}
          />
          <div
            style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}
          >
            Optimizing to {targetKB} KB…
          </div>
          <div
            className="mono"
            style={{
              fontSize: "11px",
              color: "var(--text3)",
              letterSpacing: ".1em",
            }}
          >
            Adjusting compression quality iteratively
          </div>
        </div>
      )}

      {/* Results */}
      {original && compressed && !compressing && (
        <div className="fade-up">
          <SectionHead num="03" label="Results" />

          {/* Image Comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Original */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--border2)",
                      display: "inline-block",
                    }}
                  />
                  Original
                </span>
                <span
                  className="tag mono"
                  style={{
                    background: "var(--surface3)",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {original.sizeKB} KB
                </span>
              </div>
              <div
                className="checker"
                style={{
                  aspectRatio: "4/3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={original.url}
                  alt="Original"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "16px",
                    filter: "grayscale(45%)",
                    transition: "filter .4s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter = "grayscale(0%)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter = "grayscale(45%)")
                  }
                />
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  background: "var(--surface2)",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--text3)" }}
                >
                  Hover to view in color
                </span>
                {original.isTransp && (
                  <span
                    className="tag"
                    style={{
                      background: "var(--teal-lt)",
                      color: "var(--teal)",
                      fontSize: "9px",
                    }}
                  >
                    Has Transparency
                  </span>
                )}
              </div>
            </div>

            {/* Compressed */}
            <div
              className="card image-card-featured"
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--blue)",
                      display: "inline-block",
                    }}
                  />
                  Compressed
                </span>
                <span
                  className="tag mono"
                  style={{
                    background: "var(--blue-lt)",
                    color: "var(--blue)",
                    border: "none",
                  }}
                >
                  {compressed.sizeKB} KB
                </span>
              </div>
              <div
                className="checker"
                style={{
                  aspectRatio: "4/3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={compressed.url}
                  alt="Compressed"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "16px",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  background: "var(--surface2)",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--text3)" }}
                >
                  {compressed.width} × {compressed.height}px
                </span>
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--text3)" }}
                >
                  {compressed.isAlpha
                    ? `PNG · Alpha Preserved`
                    : `JPEG · Q${compressed.quality}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div
            style={{
              borderRadius: "var(--radius)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "20px",
              background: belowTarget ? "var(--green-lt)" : "var(--amber-lt)",
              border: `1px solid ${belowTarget ? "#A7D7BC" : "#F9D27A"}`,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: belowTarget ? "var(--green)" : "var(--amber)",
                color: "#fff",
              }}
            >
              {belowTarget ? <Ico.Zap /> : <Ico.Alert />}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: belowTarget ? "#0A6432" : "#7C4A00",
                  marginBottom: "4px",
                }}
              >
                {belowTarget
                  ? `${(targetKB - parseFloat(compressed.sizeKB)).toFixed(1)} KB under target — compression complete`
                  : "Minimum quality reached — cannot compress further"}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: "11px",
                  color: belowTarget ? "#2A8A52" : "#9A6010",
                  letterSpacing: ".05em",
                }}
              >
                {belowTarget
                  ? `Target: ${targetKB} KB · Final: ${compressed.sizeKB} KB · ${savings}% reduction`
                  : `Compressed to ${compressed.sizeKB} KB — smallest possible without severe quality loss`}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {[
              {
                label: "Reduction",
                val: savings + "%",
                unit: "Smaller than source",
                color: "var(--blue)",
              },
              {
                label: "Original Size",
                val: original.sizeKB + " KB",
                unit: "Source file",
              },
              {
                label: "Final Size",
                val: compressed.sizeKB + " KB",
                unit: `Quality ${compressed.quality}%`,
                color: "var(--teal)",
              },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div
                  className="mono"
                  style={{
                    fontSize: "9px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    marginBottom: "10px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "clamp(26px,3.5vw,36px)",
                    fontWeight: 800,
                    color: s.color || "var(--text)",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: "11px",
                    color: "var(--text3)",
                    marginTop: "6px",
                  }}
                >
                  {s.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={compressed.url}
              download={`compressed.${compressed.ext}`}
              className="btn-primary"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Ico.Download /> Download Compressed Image
            </a>
            <button className="btn-next" onClick={compressNext}>
              <Ico.ArrowRight /> Compress Next
            </button>
            <button className="btn-ghost" onClick={reset}>
              <Ico.Refresh /> Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIDEO COMPRESSOR PAGE
───────────────────────────────────────────── */
function VideoCompressor({ onSwitchToImage }) {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | compressing | done | error
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [targetMB, setTargetMB] = useState(10);
  const [customMB, setCustomMB] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef(null);
  const origVidRef = useRef(null);
  const compVidRef = useRef(null);
  const mediaRecRef = useRef(null);
  const animRef = useRef(null);

  const mbOpts = [5, 10, 20, 30, 50, 100];

  // ── Core video compression using MediaRecorder ──
  const doCompressVideo = useCallback(async (file, tMB) => {
    setStatus("loading");
    setProgress(5);
    setProgressLabel("Reading video…");
    setCompressed(null);
    setErrorMsg("");

    try {
      const srcURL = URL.createObjectURL(file);

      // Load into a hidden video element to get metadata
      const metaVid = document.createElement("video");
      metaVid.preload = "metadata";
      metaVid.muted = true;

      await new Promise((res, rej) => {
        metaVid.onloadedmetadata = res;
        metaVid.onerror = () => rej(new Error("Cannot read video metadata"));
        metaVid.src = srcURL;
      });

      const duration = metaVid.duration;
      const origW = metaVid.videoWidth;
      const origH = metaVid.videoHeight;

      setProgress(15);
      setProgressLabel("Analysing video…");

      // Target bitrate calculation (preserve resolution, reduce bitrate)
      const targetBits = tMB * 1024 * 1024 * 8;
      // Assume 128kbps audio
      const audioBits = 128000;
      const videoBits = Math.max(
        100000,
        targetBits / Math.max(duration, 1) - audioBits,
      );
      const videoBPS = Math.floor(videoBits);

      setProgress(25);
      setProgressLabel("Setting up encoder…");

      // Check codec support
      const tryCodecs = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      let mimeType = "";
      for (const codec of tryCodecs) {
        if (MediaRecorder.isTypeSupported(codec)) {
          mimeType = codec;
          break;
        }
      }
      if (!mimeType)
        throw new Error(
          "Your browser does not support video recording. Please use Chrome or Edge.",
        );

      // Canvas-based re-encode: draw video frames to canvas and record
      const canvas = document.createElement("canvas");
      canvas.width = origW;
      canvas.height = origH;
      const ctx = canvas.getContext("2d");

      const playVid = document.createElement("video");
      playVid.muted = true;
      playVid.src = srcURL;
      playVid.preload = "auto";
      playVid.width = origW;
      playVid.height = origH;

      await new Promise((res, rej) => {
        playVid.oncanplaythrough = res;
        playVid.onerror = () => rej(new Error("Cannot decode video"));
        playVid.load();
      });

      setProgress(35);
      setProgressLabel("Encoding frames…");

      // Set up audio context for audio track
      let audioStream = null;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const actx = new AudioCtx();
          const src = actx.createMediaElementSource(playVid);
          const dest = actx.createMediaStreamDestination();
          src.connect(dest);
          audioStream = dest.stream;
        }
      } catch (_) {
        /* audio optional */
      }

      // Capture stream from canvas
      const canvasStream = canvas.captureStream(30);
      let combinedStream;
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } else {
        combinedStream = canvasStream;
      }

      const recOptions = { mimeType, videoBitsPerSecond: videoBPS };
      const recorder = new MediaRecorder(combinedStream, recOptions);
      mediaRecRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recDone = new Promise((res) => {
        recorder.onstop = () => res();
      });

      recorder.start(200); // collect every 200ms
      playVid.currentTime = 0;
      await playVid.play();

      // Animate canvas by drawing video frames
      const drawFrame = () => {
        if (playVid.paused || playVid.ended) return;
        ctx.drawImage(playVid, 0, 0, origW, origH);
        const pct = 35 + Math.floor((playVid.currentTime / duration) * 55);
        setProgress(pct);
        setProgressLabel(
          `Encoding… ${Math.round(playVid.currentTime)}s / ${Math.round(duration)}s`,
        );
        animRef.current = requestAnimationFrame(drawFrame);
      };
      animRef.current = requestAnimationFrame(drawFrame);

      // Wait for video to finish
      await new Promise((res) => {
        playVid.onended = res;
        playVid.onerror = res;
        // fallback timeout
        setTimeout(res, (duration + 5) * 1000);
      });

      cancelAnimationFrame(animRef.current);
      recorder.stop();
      await recDone;

      setProgress(94);
      setProgressLabel("Finalising…");

      const blob = new Blob(chunks, {
        type: mimeType.split(";")[0] || "video/webm",
      });

      setCompressed({
        blob,
        url: URL.createObjectURL(blob),
        sizeMB: (blob.size / (1024 * 1024)).toFixed(2),
        sizeBytes: blob.size,
        width: origW,
        height: origH,
        duration: duration,
        ext: "webm",
        mimeType,
        bitrate: Math.round(videoBPS / 1000),
      });

      setProgress(100);
      setProgressLabel("Done!");
      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || "Compression failed. Please try another video.",
      );
      setStatus("error");
      setProgress(0);
    }
  }, []);

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginal({
      file,
      url: URL.createObjectURL(file),
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      sizeBytes: file.size,
      name: file.name,
      type: file.type,
    });
    setStatus("compressing");
    doCompressVideo(file, targetMB);
  };

  const selectMB = (s) => {
    setTargetMB(s);
    setCustomMB("");
  };
  const handleCustom = (e) => {
    const v = e.target.value;
    setCustomMB(v);
    if (v && !isNaN(v) && Number(v) > 0) setTargetMB(parseFloat(v));
  };

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      try {
        mediaRecRef.current.stop();
      } catch (_) {}
    }
    setOriginal(null);
    setCompressed(null);
    setStatus("idle");
    setProgress(0);
    setProgressLabel("");
    setErrorMsg("");
    setCustomMB("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const compressNext = () => {
    reset();
    setTimeout(() => fileRef.current?.click(), 150);
  };

  const origMB = original ? parseFloat(original.sizeMB) : 0;
  const compMB = compressed ? parseFloat(compressed.sizeMB) : 0;
  const savings =
    origMB > 0 && compMB > 0
      ? Math.max(0, (1 - compMB / origMB) * 100).toFixed(0)
      : 0;
  const belowTarget = compressed && compMB <= targetMB;
  const isCompressing = status === "loading" || status === "compressing";

  return (
    <div>
      {/* Target Size Selector */}
      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <SectionHead num="01" label="Set Target Size" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          {mbOpts.map((s) => (
            <button
              key={s}
              className={`size-btn${targetMB === s && !customMB ? " active" : ""}`}
              onClick={() => selectMB(s)}
            >
              <span
                style={{ fontSize: "16px", fontWeight: 700, display: "block" }}
              >
                {s}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: "10px",
                  display: "block",
                  marginTop: "2px",
                  opacity: 0.75,
                }}
              >
                MB
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface2)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-xs)",
            overflow: "hidden",
          }}
        >
          <label
            htmlFor="vid-custom"
            className="mono"
            style={{
              fontSize: "10px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--text3)",
              padding: "0 18px",
              borderRight: "1px solid var(--border)",
              height: "50px",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            Custom
          </label>
          <input
            id="vid-custom"
            type="number"
            value={customMB}
            onChange={handleCustom}
            placeholder="Enter MB amount…"
            min="1"
            step="0.5"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              padding: "0 18px",
              fontFamily: "'Fira Code',monospace",
              fontSize: "14px",
              color: "var(--text)",
              outline: "none",
              height: "50px",
            }}
          />
          <div
            className="mono"
            style={{
              padding: "0 20px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(135deg,var(--teal),#077C78)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              borderLeft: "1px solid rgba(255,255,255,.15)",
            }}
          >
            → {targetMB} MB
          </div>
        </div>

        {/* Info note */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "var(--surface3)",
            borderRadius: "var(--radius-xs)",
            border: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{ color: "var(--blue)", flexShrink: 0, marginTop: "2px" }}
          >
            <Ico.Check />
          </span>
          <span
            className="mono"
            style={{
              fontSize: "10px",
              color: "var(--text2)",
              lineHeight: 1.7,
              letterSpacing: ".04em",
            }}
          >
            Resolution is always preserved. Compression is achieved by reducing
            bitrate only — no frame dropping or scaling. Output format: WebM
            (widely supported in Chrome, Firefox, Edge).
          </span>
        </div>
      </div>

      {/* Upload */}
      {status === "idle" && (
        <div className="card" style={{ padding: "32px" }}>
          <SectionHead num="02" label="Upload Video" />
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            id="vid-file"
            onChange={onFile}
          />
          <label htmlFor="vid-file">
            <div className="upload-zone">
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 24px",
                  background: "var(--surface)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border)",
                  color: "var(--text3)",
                  boxShadow: "var(--shadow-sm)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Ico.Film />
              </div>
              <div
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "clamp(18px,2.5vw,24px)",
                  fontWeight: 700,
                  marginBottom: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Drop your video here
              </div>
              <div
                className="mono"
                style={{
                  fontSize: "11px",
                  color: "var(--text3)",
                  letterSpacing: ".1em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                or click anywhere to browse files
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {["MP4", "WebM", "MOV", "AVI", "MKV"].map((f) => (
                  <span
                    key={f}
                    className="mono"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "99px",
                      padding: "4px 12px",
                      fontSize: "10px",
                      color: "var(--text3)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Compressing */}
      {isCompressing && (
        <div
          className="card"
          style={{ padding: "48px 40px", textAlign: "center" }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              border: "3px solid var(--border)",
              borderTopColor: "var(--teal)",
              borderRadius: "50%",
              animation: "spin 1.1s linear infinite",
              margin: "0 auto 24px",
            }}
          />
          <div
            style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}
          >
            Compressing Video…
          </div>
          <div
            className="mono"
            style={{
              fontSize: "11px",
              color: "var(--text3)",
              letterSpacing: ".1em",
              marginBottom: "28px",
            }}
          >
            {progressLabel}
          </div>
          <div style={{ maxWidth: "440px", margin: "0 auto 12px" }}>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div
            className="mono"
            style={{ fontSize: "12px", color: "var(--teal)", fontWeight: 500 }}
          >
            {progress}%
          </div>
          {original && (
            <div
              style={{
                marginTop: "24px",
                padding: "16px 24px",
                background: "var(--surface3)",
                borderRadius: "var(--radius-xs)",
                border: "1px solid var(--border)",
                display: "inline-flex",
                gap: "24px",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: "11px", color: "var(--text3)" }}
              >
                Source:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {original.sizeMB} MB
                </strong>
              </span>
              <span
                className="mono"
                style={{ fontSize: "11px", color: "var(--text3)" }}
              >
                Target:{" "}
                <strong style={{ color: "var(--teal)" }}>{targetMB} MB</strong>
              </span>
            </div>
          )}
          <div style={{ marginTop: "16px" }}>
            <button
              className="btn-ghost"
              style={{ fontSize: "13px", padding: "10px 20px" }}
              onClick={reset}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div
          className="card fade-up"
          style={{
            padding: "40px",
            textAlign: "center",
            border: "1px solid #FFCDD2",
            background: "#FFF5F5",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "#FFE0E0",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              color: "var(--red)",
            }}
          >
            <Ico.Alert />
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--red)",
              marginBottom: "8px",
            }}
          >
            Compression Failed
          </div>
          <div
            className="mono"
            style={{
              fontSize: "12px",
              color: "#9B3333",
              marginBottom: "24px",
              lineHeight: 1.7,
            }}
          >
            {errorMsg}
          </div>
          <button className="btn-ghost" onClick={reset}>
            <Ico.Refresh /> Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {status === "done" && original && compressed && (
        <div className="fade-up">
          <SectionHead num="03" label="Results" />

          {/* Video comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Original */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--border2)",
                      display: "inline-block",
                    }}
                  />
                  Original
                </span>
                <span
                  className="tag mono"
                  style={{
                    background: "var(--surface3)",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {original.sizeMB} MB
                </span>
              </div>
              <div
                style={{
                  aspectRatio: "16/9",
                  background: "#0A0A14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <video
                  ref={origVidRef}
                  src={original.url}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  background: "var(--surface2)",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--text3)" }}
                >
                  {original.width || compressed.width} ×{" "}
                  {original.height || compressed.height}px ·{" "}
                  {fmtDur(compressed.duration)}
                </span>
              </div>
            </div>

            {/* Compressed */}
            <div
              className="card"
              style={{
                overflow: "hidden",
                boxShadow: "0 0 0 2px var(--teal), var(--shadow-lg)",
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--teal)",
                      display: "inline-block",
                    }}
                  />
                  Compressed
                </span>
                <span
                  className="tag mono"
                  style={{
                    background: "var(--teal-lt)",
                    color: "var(--teal)",
                    border: "none",
                  }}
                >
                  {compressed.sizeMB} MB
                </span>
              </div>
              <div
                style={{
                  aspectRatio: "16/9",
                  background: "#0A0A14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <video
                  ref={compVidRef}
                  src={compressed.url}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  background: "var(--surface2)",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--text3)" }}
                >
                  {compressed.width} × {compressed.height}px · WebM
                </span>
                <span
                  className="mono"
                  style={{ fontSize: "10px", color: "var(--teal)" }}
                >
                  ~{compressed.bitrate} kbps
                </span>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div
            style={{
              borderRadius: "var(--radius)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "20px",
              background: belowTarget ? "var(--green-lt)" : "var(--amber-lt)",
              border: `1px solid ${belowTarget ? "#A7D7BC" : "#F9D27A"}`,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: belowTarget ? "var(--green)" : "var(--amber)",
                color: "#fff",
              }}
            >
              {belowTarget ? <Ico.Zap /> : <Ico.Alert />}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: belowTarget ? "#0A6432" : "#7C4A00",
                  marginBottom: "4px",
                }}
              >
                {belowTarget
                  ? `${(targetMB - compMB).toFixed(2)} MB under target — compression complete`
                  : "Bitrate minimised — cannot reduce further without quality loss"}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: "11px",
                  color: belowTarget ? "#2A8A52" : "#9A6010",
                  letterSpacing: ".05em",
                }}
              >
                {belowTarget
                  ? `Target: ${targetMB} MB · Final: ${compressed.sizeMB} MB · ${savings}% reduction`
                  : `Compressed to ${compressed.sizeMB} MB — lowest bitrate at full resolution`}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            {[
              {
                label: "Reduction",
                val: savings + "%",
                unit: "File size saved",
                color: "var(--teal)",
              },
              {
                label: "Original",
                val: original.sizeMB + " MB",
                unit: "Source file",
              },
              {
                label: "Final Size",
                val: compressed.sizeMB + " MB",
                unit: "Compressed output",
                color: "var(--blue)",
              },
              {
                label: "Resolution",
                val: `${compressed.width}×${compressed.height}`,
                unit: "Unchanged · Full quality",
              },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div
                  className="mono"
                  style={{
                    fontSize: "9px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    marginBottom: "10px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "clamp(18px,2.5vw,26px)",
                    fontWeight: 800,
                    color: s.color || "var(--text)",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--text3)",
                    marginTop: "6px",
                  }}
                >
                  {s.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={compressed.url}
              download={`compressed.${compressed.ext}`}
              className="btn-teal"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Ico.Download /> Download Compressed Video
            </a>
            <button className="btn-next" onClick={compressNext}>
              <Ico.ArrowRight /> Compress Next
            </button>
            <button className="btn-ghost" onClick={reset}>
              <Ico.Refresh /> Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("image"); // "image" | "video"

  return (
    <>
      <G />
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          paddingBottom: "60px",
        }}
      >
        <div
          style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}
        >
          {/* ── HEADER ── */}
          <header
            style={{
              padding: "44px 0 36px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {/* Brand */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background:
                      page === "image"
                        ? "linear-gradient(135deg,#3563E9,#1D3FA8)"
                        : "linear-gradient(135deg,#0EA5A0,#077C78)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      page === "image"
                        ? "0 6px 20px rgba(53,99,233,.3)"
                        : "0 6px 20px rgba(14,165,160,.3)",
                    transition: "all .4s ease",
                    color: "#fff",
                  }}
                >
                  {page === "image" ? <Ico.Image /> : <Ico.Video />}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: "clamp(20px,3vw,26px)",
                      fontWeight: 800,
                      letterSpacing: "-.4px",
                      color: "var(--text)",
                    }}
                  >
                    UnclePower Compressor
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: "10px",
                      color: "var(--text3)",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      marginTop: "4px",
                    }}
                  >
                    Professional Compression Studio
                  </div>
                </div>
              </div>

              {/* Live badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--green-lt)",
                  border: "1px solid #A7D7BC",
                  borderRadius: "99px",
                  padding: "8px 16px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "var(--green)",
                    display: "inline-block",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  className="mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--green)",
                    letterSpacing: ".08em",
                    fontWeight: 500,
                  }}
                >
                  Resolution Preserved
                </span>
              </div>
            </div>

            {/* ── NAV TOGGLE ── */}
            <div style={{ marginTop: "28px" }}>
              <div className="nav-pill" style={{ maxWidth: "440px" }}>
                <button
                  className={`nav-pill-btn ${page === "image" ? "active" : "inactive"}`}
                  onClick={() => setPage("image")}
                >
                  <span
                    style={{
                      color: page === "image" ? "var(--blue)" : "var(--text3)",
                    }}
                  >
                    <Ico.Image />
                  </span>
                  Image Compressor
                </button>
                <button
                  className={`nav-pill-btn ${page === "video" ? "active" : "inactive"}`}
                  onClick={() => setPage("video")}
                >
                  <span
                    style={{
                      color: page === "video" ? "var(--teal)" : "var(--text3)",
                    }}
                  >
                    <Ico.Video />
                  </span>
                  Video Compressor
                </button>
              </div>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <div key={page} className="slide-in">
            {page === "image" ? (
              <ImageCompressor onSwitchToVideo={() => setPage("video")} />
            ) : (
              <VideoCompressor onSwitchToImage={() => setPage("image")} />
            )}
          </div>

          {/* ── FOOTER ── */}
          <footer
            style={{
              marginTop: "56px",
              paddingTop: "28px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <p
              className="mono"
              style={{
                fontSize: "10px",
                color: "var(--text3)",
                letterSpacing: ".1em",
                maxWidth: "520px",
                lineHeight: 1.9,
              }}
            >
              Processing happens{" "}
              <strong style={{ color: "var(--blue)", fontWeight: 500 }}>
                entirely in your browser
              </strong>
              . No files are uploaded to any server. Resolution is always
              preserved — image quality and video bitrate are adjusted only.
              Transparent PNG images retain full alpha channel.
            </p>
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "13px",
                color: "var(--text3)",
                fontWeight: 500,
              }}
            >
              Compression Studio
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
