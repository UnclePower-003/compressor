import { useState, useRef } from "react";

// For the sake of the demo, I'm assuming Tailwind is available in your environment.
// Colors used:
// Primary: #B11E38, PrimaryL: #E25B71, PrimaryD: #8E182D
// SecondaryText: #C9962A, ThirdText: #0E733D

function IconUpload({ className }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
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

  return (
    <div className="min-bg-stone-50 min-h-screen font-poppins text-stone-900 selection:bg-[#B11E38]/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#B11E38] rounded-2xl flex items-center justify-center shadow-lg shadow-[#B11E38]/20 rotate-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#B11E38] tracking-tight">
                UnclePower
              </h1>
              <p className="text-sm font-medium text-[#C9962A] uppercase tracking-widest leading-relaxed">
                Compression Studio
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#B11E38]/5 border border-[#B11E38]/20 px-4 py-2 rounded-full text-[#B11E38] text-xs font-bold">
            <span className="w-2 h-2 bg-[#B11E38] rounded-full animate-pulse"></span>
            BROWSER-SIDE SECURE
          </div>
        </header>

        {/* Step 01: Set Target */}
        <section className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm mb-8 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-white bg-[#C9962A] px-2 py-0.5 rounded">
              01
            </span>
            <h2 className="text-lg font-bold text-stone-800">Target Size</h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setTargetSize(s);
                  setCustomSize("");
                }}
                className={`py-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${
                  targetSize === s && !customSize
                    ? "bg-[#B11E38] border-[#B11E38] text-white shadow-md -translate-y-1"
                    : "bg-white border-stone-100 text-stone-500 hover:border-[#B11E38]/30"
                }`}
              >
                {s} <span className="text-[10px] opacity-70">KB</span>
              </button>
            ))}
          </div>

          <div className="flex items-center bg-stone-50 rounded-xl border border-stone-200 overflow-hidden focus-within:border-[#B11E38] transition-colors">
            <span className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase border-r border-stone-200">
              Custom
            </span>
            <input
              type="number"
              value={customSize}
              onChange={(e) => {
                setCustomSize(e.target.value);
                setTargetSize(Number(e.target.value));
              }}
              placeholder="Enter KB..."
              className="bg-transparent flex-1 px-4 outline-none text-sm font-semibold"
            />
            <div className="bg-[#8E182D] text-white px-6 py-3 text-sm font-bold">
              {targetSize} KB
            </div>
          </div>
        </section>

        {/* Step 02: Upload */}
        {!originalImage && (
          <section className="animate-fadeIn">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="file-in"
              onChange={handleImageUpload}
            />
            <label htmlFor="file-in" className="group block cursor-pointer">
              <div className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-[2.5rem] p-16 text-center transition-all group-hover:border-[#B11E38] group-hover:bg-white group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center border border-stone-200 shadow-sm mb-6 transition-all group-hover:bg-[#B11E38] group-hover:text-white">
                  <IconUpload className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  Drop your image here
                </h3>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">
                  JPG, PNG, or WebP up to 20MB
                </p>
              </div>
            </label>
          </section>
        )}

        {/* Compression State */}
        {isCompressing && (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-stone-200">
            <div className="w-12 h-12 border-4 border-stone-100 border-t-[#B11E38] rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-stone-800">
              Optimizing Image
            </h3>
            <p className="text-sm text-stone-500 mt-2">
              Targeting {targetSize} KB...
            </p>
          </div>
        )}

        {/* Step 03: Results */}
        {originalImage && compressedImage && !isCompressing && (
          <div className="space-y-8 animate-fadeUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-white rounded-3xl overflow-hidden border border-stone-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Original
                  </span>
                  <span className="text-xs font-bold text-stone-600 px-3 py-1 bg-white rounded-full border border-stone-200">
                    {originalImage.sizeInKB} KB
                  </span>
                </div>
                <div className="aspect-video bg-stone-100 flex items-center justify-center p-4">
                  <img
                    src={originalImage.url}
                    alt="Original"
                    className="max-h-full object-contain grayscale opacity-50"
                  />
                </div>
              </div>

              {/* Compressed */}
              <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#B11E38] shadow-lg shadow-[#B11E38]/5">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-[#B11E38]/5">
                  <span className="text-[10px] font-bold text-[#B11E38] uppercase tracking-widest">
                    Optimized
                  </span>
                  <span className="text-xs font-bold text-white px-3 py-1 bg-[#B11E38] rounded-full">
                    {compressedImage.sizeInKB} KB
                  </span>
                </div>
                <div className="aspect-video bg-stone-50 flex items-center justify-center p-4">
                  <img
                    src={compressedImage.url}
                    alt="Compressed"
                    className="max-h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="bg-stone-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
              <div>
                <div className="text-[#C9962A] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Compression Report
                </div>
                <div className="text-3xl font-bold">
                  Saved{" "}
                  <span className="text-[#B11E38]">
                    {(
                      (1 - compressedImage.sizeInKB / originalImage.sizeInKB) *
                      100
                    ).toFixed(0)}
                    %
                  </span>{" "}
                  of total space
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <a
                  href={compressedImage.url}
                  download="optimized-image.jpg"
                  className="flex-1 md:flex-none bg-[#B11E38] hover:bg-[#8E182D] text-white font-bold py-4 px-8 rounded-2xl transition-all hover:-translate-y-1 shadow-lg shadow-[#B11E38]/30 flex items-center justify-center gap-2"
                >
                  Download Image
                </a>
                <button
                  onClick={reset}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-4 px-6 rounded-2xl transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400 max-w-md text-center md:text-left leading-relaxed">
            Privacy First: Images are processed{" "}
            <strong className="text-stone-600">locally in your browser</strong>.
            We never see your data.
          </p>
          <div className="text-[#B11E38] font-bold text-sm tracking-tight">
            UnclePower Studio &copy; 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
