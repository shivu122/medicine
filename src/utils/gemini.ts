import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, ANALYSIS_PROMPT } from './constants';
import { validateImageData } from './validators';
import type { AnalysisResult } from '../types/analysis';

const genAI = new GoogleGenerativeAI(AI_CONFIG.API_KEY);

export async function analyzeMedicineImage(imageData: string): Promise<AnalysisResult> {
  try {
    const base64Data = validateImageData(imageData);
    const model = genAI.getGenerativeModel({ model: AI_CONFIG.MODEL });
    
    const result = await model.generateContent([
      ANALYSIS_PROMPT,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      }
    ]);

    if (!result?.response) {
      throw new Error('Failed to get response from AI model');
    }

    const text = result.response.text();
    if (!text) {
      throw new Error('Empty response from AI model');
    }
    
    return text === 'NOT_MEDICINE' 
      ? { isMedicine: false, details: null }
      : { isMedicine: true, details: text };
      
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message
      : 'An unexpected error occurred while analyzing the image';
    
    console.error('Image analysis error:', errorMessage);
    throw new Error(errorMessage);
  }
}