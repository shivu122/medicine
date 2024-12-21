import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import Webcam from 'react-webcam';
import { analyzeMedicineImage } from '../utils/gemini';
import { validateImageFile } from '../utils/validators';
import type { AnalysisResult } from '../types/analysis';

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      validateImageFile(file);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImage(base64String);
        await analyzeImage(base64String);
      };
      reader.onerror = () => {
        throw new Error('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setResult({
        isMedicine: false,
        details: null,
        error: error instanceof Error ? error.message : 'Failed to process image'
      });
    }
  };

  const captureImage = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image from camera');
      }
      setImage(imageSrc);
      setShowCamera(false);
      await analyzeImage(imageSrc);
    } catch (error) {
      setResult({
        isMedicine: false,
        details: null,
        error: error instanceof Error ? error.message : 'Failed to capture image'
      });
    }
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    setResult(null);
    
    try {
      const analysis = await analyzeMedicineImage(imageData);
      setResult(analysis);
    } catch (error) {
      setResult({
        isMedicine: false,
        details: null,
        error: error instanceof Error ? error.message : 'Failed to analyze image'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            disabled={analyzing}
          >
            <Upload className="h-5 w-5" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => setShowCamera(!showCamera)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            disabled={analyzing}
          >
            <Camera className="h-5 w-5" />
            <span>{showCamera ? 'Hide Camera' : 'Open Camera'}</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        />

        {showCamera && (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
            />
            <button
              onClick={captureImage}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={analyzing}
            >
              Capture
            </button>
          </div>
        )}

        {image && !showCamera && (
          <div className="mt-4">
            <img src={image} alt="Uploaded medicine" className="max-w-full rounded-lg" />
          </div>
        )}

        {analyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Analyzing image...</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            {result.error ? (
              <div className="text-red-600">
                <p className="font-semibold">Error:</p>
                <p>{result.error}</p>
              </div>
            ) : result.isMedicine ? (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
                <div className="whitespace-pre-wrap">{result.details}</div>
              </div>
            ) : (
              <p className="text-yellow-600">This image does not appear to contain medicine. Please try again with a clear image of medication.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;