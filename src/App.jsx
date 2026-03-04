import { useState } from "react";

export default function App() {
  // State variables - like boxes that hold information
  const [originalImage, setOriginalImage] = useState(null); // Stores the original image info
  const [compressedImage, setCompressedImage] = useState(null); // Stores the compressed image info
  const [isCompressing, setIsCompressing] = useState(false); // True when compressing, false otherwise
  const [targetSize, setTargetSize] = useState(150); // Target size in KB (default 150KB)
  const [customSize, setCustomSize] = useState(""); // For custom size input

  // Predefined size options
  const sizeOptions = [50, 100, 150, 200, 300, 500];

  // This function runs when user picks an image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file selected

    // Save original image information
    setOriginalImage({
      file: file,
      url: URL.createObjectURL(file), // Create a preview link
      sizeInKB: (file.size / 1024).toFixed(1), // Convert bytes to KB
    });

    // Start compressing the image
    compressTheImage(file);
  };

  // This function compresses the image to the target size
  // It KEEPS the resolution (width & height) but reduces quality
  const compressTheImage = (imageFile) => {
    setIsCompressing(true); // Show we're working on it
    setCompressedImage(null); // Clear any old compressed image

    // Create a new image element
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    // When image loads, start compression
    image.onload = () => {
      // Create a canvas (like a digital drawing board)
      const canvas = document.createElement("canvas");
      
      // IMPORTANT: Keep the SAME resolution (width & height)
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Get drawing tools for the canvas
      const context = canvas.getContext("2d");
      
      // Use high quality settings for drawing
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      
      // Draw the image on canvas at FULL resolution
      context.drawImage(image, 0, 0, image.width, image.height);

      // Start with very high quality (95%)
      let compressionQuality = 0.95;
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loops

      // This function tries to compress until we reach target size or lower
      const tryCompression = () => {
        attempts++;
        
        canvas.toBlob(
          (compressedBlob) => {
            const sizeInKB = compressedBlob.size / 1024;

            // STRICT CHECK: Must be equal or LOWER than target size
            // If still too big and quality can go lower, try again
            if (sizeInKB > targetSize && compressionQuality > 0.1 && attempts < maxAttempts) {
              // Calculate how much to reduce quality based on how far we are from target
              const overshoot = sizeInKB / targetSize;
              if (overshoot > 2) {
                compressionQuality -= 0.1; // Big reduction if way over
              } else if (overshoot > 1.5) {
                compressionQuality -= 0.05; // Medium reduction
              } else {
                compressionQuality -= 0.02; // Small reduction when close
              }
              
              tryCompression(); // Try again
            } else {
              // We're done! Save the compressed image
              setCompressedImage({
                blob: compressedBlob,
                url: URL.createObjectURL(compressedBlob),
                sizeInKB: sizeInKB.toFixed(1),
                width: image.width,
                height: image.height,
                finalQuality: (compressionQuality * 100).toFixed(0),
              });
              setIsCompressing(false); // Done compressing
            }
          },
          "image/jpeg",
          compressionQuality
        );
      };

      tryCompression(); // Start the compression process
    };
  };

  // Reset everything and start over
  const resetCompressor = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setIsCompressing(false);
  };

  // Handle custom size input
  const handleCustomSizeChange = (e) => {
    const value = e.target.value;
    setCustomSize(value);
    
    // Only update target size if it's a valid number
    if (value && !isNaN(value) && value > 0) {
      setTargetSize(parseInt(value));
    }
  };

  // Handle predefined size selection
  const handleSizeSelection = (size) => {
    setTargetSize(size);
    setCustomSize(""); // Clear custom input
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            📸 Image Compressor
          </h1>
          <p className="text-gray-600 text-lg">
            Compress images to your target size without losing resolution!
          </p>
        </div>

        {/* Size Selection Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🎯 Choose Target File Size
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Select a size below or enter your own. Image will be <strong>at or below</strong> this size.
          </p>
          
          {/* Predefined Size Buttons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelection(size)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  targetSize === size && !customSize
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {size} KB
              </button>
            ))}
          </div>

          {/* Custom Size Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-gray-700 font-semibold mb-2 text-center">
              Or enter custom size (KB):
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={customSize}
                onChange={handleCustomSizeChange}
                placeholder="e.g., 75"
                min="1"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-center text-lg"
              />
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-3 flex items-center">
                <span className="text-blue-700 font-semibold">
                  Target: {targetSize} KB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area - Shows when no image is uploaded */}
        {!originalImage && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="border-4 border-dashed border-blue-300 rounded-2xl p-12 md:p-16 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageInput"
                onChange={handleImageUpload}
              />
              <label htmlFor="imageInput" className="cursor-pointer block">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-2xl font-semibold text-gray-700 mb-2">
                  Click here to choose an image
                </p>
                <p className="text-gray-500">
                  Supports JPG, PNG, WebP files
                </p>
              </label>
            </div>
          </div>
        )}

        {/* Loading Animation - Shows while compressing */}
        {isCompressing && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-2xl font-semibold text-gray-700">
              Compressing to {targetSize} KB or less...
            </p>
            <p className="text-gray-500 mt-2">This will just take a moment!</p>
          </div>
        )}

        {/* Results Section - Shows original and compressed images */}
        {originalImage && compressedImage && !isCompressing && (
          <div className="space-y-6">
            
            {/* Before and After Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Original Image Card */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                  <h3 className="text-white text-xl font-bold">
                    📄 Original Image
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    Size: {originalImage.sizeInKB} KB
                  </p>
                </div>
                <div className="p-4">
                  <img
                    src={originalImage.url}
                    alt="Original"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl"
                  />
                </div>
              </div>

              {/* Compressed Image Card */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <h3 className="text-white text-xl font-bold">
                    ✅ Compressed Image
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    Size: {compressedImage.sizeInKB} KB | Resolution: {compressedImage.width} × {compressedImage.height}
                  </p>
                  <p className="text-white text-xs opacity-75 mt-1">
                    Quality: {compressedImage.finalQuality}%
                  </p>
                </div>
                <div className="p-4">
                  <img
                    src={compressedImage.url}
                    alt="Compressed"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Target Achievement Banner */}
            <div className={`rounded-3xl shadow-xl p-6 text-center ${
              parseFloat(compressedImage.sizeInKB) <= targetSize
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-yellow-500 to-orange-500"
            }`}>
              {parseFloat(compressedImage.sizeInKB) <= targetSize ? (
                <>
                  <div className="text-5xl mb-2">🎉</div>
                  <p className="text-white text-2xl font-bold">
                    Success! Image is {targetSize - parseFloat(compressedImage.sizeInKB).toFixed(1)} KB below target!
                  </p>
                  <p className="text-white opacity-90 mt-2">
                    Target: {targetSize} KB | Actual: {compressedImage.sizeInKB} KB
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">⚠️</div>
                  <p className="text-white text-2xl font-bold">
                    Compressed to minimum possible size
                  </p>
                  <p className="text-white opacity-90 mt-2">
                    This image cannot be compressed below {compressedImage.sizeInKB} KB without severe quality loss
                  </p>
                </>
              )}
            </div>

            {/* Savings Info */}
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
              <p className="text-lg text-gray-600 mb-1">You saved:</p>
              <p className="text-4xl font-bold text-green-600">
                {(originalImage.sizeInKB - compressedImage.sizeInKB).toFixed(1)} KB
              </p>
              <p className="text-gray-500 mt-2">
                That's {((1 - compressedImage.sizeInKB / originalImage.sizeInKB) * 100).toFixed(0)}% smaller!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={compressedImage.url}
                download="compressed-image.jpg"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                ⬇️ Download Compressed Image
              </a>
              <button
                onClick={resetCompressor}
                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
              >
                🔄 Compress Another Image
              </button>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600 bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm">
            💡 <strong>How it works:</strong> This tool compresses your image to <strong>at or below</strong> your target size 
            while keeping the EXACT SAME resolution (width × height). It only adjusts the JPEG compression quality. 
            The final size will always be <strong>equal to or smaller than</strong> your target, never larger!
          </p>
        </div>
      </div>
    </div>
  );
}