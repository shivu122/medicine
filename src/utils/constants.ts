// AI Model configuration
export const AI_CONFIG = {
  API_KEY: 'AIzaSyD775P_p56q3ebGsj-A1UZSdRDEJvqyqrE',
  MODEL: 'gemini-1.5-flash',
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Analysis prompts
export const ANALYSIS_PROMPT = `Analyze this image and determine if it shows medicine/pills/tablets. If it does, provide detailed information about:
1) The type of medicine
2) Its typical uses
3) Common dosage
4) Important warnings.
If it's not medicine, respond with 'NOT_MEDICINE'.`;