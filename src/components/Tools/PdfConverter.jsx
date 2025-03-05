// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Progress } from '@/components/ui/progress';
// import { Download, Upload, FileText, Check, AlertTriangle } from 'lucide-react';

// const PdfConverter = () => {
//   const [file, setFile] = useState(null);
//   const [convertedText, setConvertedText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
  
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setFile(null);
//       setError('Please select a valid PDF file');
//     }
//   };
  
//   const handleConvert = async () => {
//     if (!file) {
//       setError('Please select a PDF file first');
//       return;
//     }
    
//     setLoading(true);
//     setProgress(0);
//     setError('');
//     setSuccess(false);
    
//     try {
//       // Simulating a progress bar for the conversion process
//       const progressInterval = setInterval(() => {
//         setProgress(prev => {
//           const newProgress = prev + 10;
//           if (newProgress >= 100) {
//             clearInterval(progressInterval);
//             return 100;
//           }
//           return newProgress;
//         });
//       }, 300);
      
//       // Here we would normally send the PDF file to a backend API
//       // For now, we'll simulate the conversion with a timeout
//       setTimeout(() => {
//         clearInterval(progressInterval);
//         setProgress(100);
//         setLoading(false);
//         setConvertedText(`Sample extracted text from ${file.name}.\n\nThis is where the actual text extracted from the PDF would appear. In a production implementation, this would be the result returned from the backend PDF parsing service.\n\nThe text could then be used for further processing, such as being input into the quiz generator or flashcard creator.`);
//         setSuccess(true);
//       }, 3000);
      
//     } catch (err) {
//       setLoading(false);
//       setError('Error converting PDF: ' + err.message);
//     }
//   };
  
//   const handleDownload = () => {
//     if (!convertedText) return;
    
//     const blob = new Blob([convertedText], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = file ? file.name.replace('.pdf', '.txt') : 'converted-text.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };
  
//   const handleClear = () => {
//     setFile(null);
//     setConvertedText('');
//     setProgress(0);
//     setError('');
//     setSuccess(false);
//     // Reset the file input
//     const fileInput = document.getElementById('pdf-file');
//     if (fileInput) fileInput.value = '';
//   };
  
//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-6 w-6" />
//           PDF Text Extractor
//         </CardTitle>
//         <CardDescription>
//           Upload a PDF file to extract its text content for use in quizzes and flashcards
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="pdf-file">Select PDF File</Label>
//           <Input 
//             id="pdf-file" 
//             type="file" 
//             accept=".pdf" 
//             onChange={handleFileChange} 
//             disabled={loading}
//           />
//           {file && (
//             <p className="text-sm text-gray-500">
//               Selected: {file.name} ({Math.round(file.size / 1024)} KB)
//             </p>
//           )}
//         </div>
        
//         {error && (
//           <Alert variant="destructive">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
        
//         {success && (
//           <Alert className="bg-green-50 border-green-200">
//             <Check className="h-4 w-4 text-green-600" />
//             <AlertTitle className="text-green-800">Success</AlertTitle>
//             <AlertDescription className="text-green-700">
//               PDF successfully converted to text
//             </AlertDescription>
//           </Alert>
//         )}
        
//         {loading && (
//           <div className="space-y-2">
//             <Label>Converting PDF...</Label>
//             <Progress value={progress} className="w-full" />
//             <p className="text-sm text-gray-500 text-right">{progress}%</p>
//           </div>
//         )}
        
//         {convertedText && (
//           <div className="space-y-2">
//             <Label htmlFor="converted-text">Extracted Text</Label>
//             <div className="border rounded-md p-3 bg-gray-50 max-h-64 overflow-y-auto">
//               <pre className="whitespace-pre-wrap text-sm">{convertedText}</pre>
//             </div>
//           </div>
//         )}
//       </CardContent>
      
//       <CardFooter className="flex justify-between">
//         <div>
//           <Button 
//             variant="outline" 
//             onClick={handleClear}
//             disabled={loading || (!file && !convertedText)}
//           >
//             Clear
//           </Button>
//         </div>
//         <div className="flex gap-2">
//           <Button 
//             onClick={handleConvert} 
//             disabled={!file || loading}
//             className="flex items-center gap-2"
//           >
//             <Upload className="h-4 w-4" />
//             Convert PDF
//           </Button>
          
//           <Button 
//             variant="secondary" 
//             onClick={handleDownload} 
//             disabled={!convertedText || loading}
//             className="flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Download Text
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PdfConverter;