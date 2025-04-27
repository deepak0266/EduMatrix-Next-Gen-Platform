import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ✅ PDF se text extract karne ka function
export const extractTextFromPDF = async (pdfSource) => {
  let loadingTask;

  if (typeof pdfSource === 'string') {
    // URL diya gaya hai
    loadingTask = pdfjsLib.getDocument(pdfSource);
  } else if (pdfSource instanceof File) {
    // Uploaded file diya gaya hai
    const fileData = await readFileAsArrayBuffer(pdfSource);
    loadingTask = pdfjsLib.getDocument({ data: fileData });
  } else {
    throw new Error('Invalid PDF source: Must be a URL string or File object.');
  }

  const pdf = await loadingTask.promise;
  let textContent = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    textContent += pageText + '\n\n';
  }

  return textContent;
};

// ✅ OpenAI se summary banane ka function (Project API key + Org ID ke sath)
export const summarizeText = async (text, length = 'medium', format = 'paragraph') => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const OPENAI_ORG_ID = process.env.REACT_APP_OPENAI_ORG_ID;
  

  if (!OPENAI_API_KEY || !OPENAI_ORG_ID) {
    throw new Error('OpenAI API key or Organization ID not found. Check your .env.local file.');
  }

  const prompt = generatePrompt(text, length, format);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Organization': OPENAI_ORG_ID,   // 🛡️ Add org ID here!
        },
      }
    );

    const summary = response.data.choices[0]?.message?.content?.trim();
    return summary;
  } catch (error) {
    console.error('❌ Error generating summary:', error.response?.data || error.message);
    throw new Error('Failed to generate summary.');
  }
};

// ✅ File ko ArrayBuffer me convert karne wala helper
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// ✅ Dynamic prompt generate karne ka helper
const generatePrompt = (text, length, format) => {
  return `
You are a professional document summarizer.

Summarize the following text:
---
${text}
---

Summary preferences:
- Length: ${length} (short / medium / long)
- Format: ${format} (paragraph / bullet points / numbered list)

Be clear, concise, and preserve the original meaning.
  `;
};
