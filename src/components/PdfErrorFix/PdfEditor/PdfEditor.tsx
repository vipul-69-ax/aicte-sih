import React, { useEffect, useState } from 'react';
import { extractTextFromPDF, FormattedTextBlock } from '@/lib/pdfjs-setup';
import { MarkdownEditor } from './MarkdownEditor';
import { Loader2, Download, Upload } from 'lucide-react';
import { usePDFConverter } from '@/hooks/usePdfConverter';
import { Button } from '@/components/ui/button';

interface PDFMarkdownConverterProps {
  url: string;
  onError?: (error: string) => void;
}

const PDFMarkdownConverter: React.FC<PDFMarkdownConverterProps> = ({ 
  url: initialUrl, 
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<FormattedTextBlock[]>([]);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const { convertToPDF, isConverting, error: pdfError } = usePDFConverter();

  const convertPDF = async (url: string) => {
    try {
      setLoading(true);
      const formattedBlocks = await extractTextFromPDF(url);
      setContent(formattedBlocks);
    } catch (err) {
      const errorMessage = 'Failed to convert PDF. Please check the URL and try again.';
      onError?.(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUrl) {
      convertPDF(currentUrl);
    }
  }, [currentUrl]);

  useEffect(() => {
    if (pdfError) {
      onError?.(pdfError);
    }
  }, [pdfError, onError]);

  const handleUpload = () => {
    try{
    const blob = convertToPDF(content);
        if(blob == null) throw Error("Cannot upload pdf")
        else {
            // handle upload of supabase
    } 
    }
    catch(err){}
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">PDF Content</h2>
        <div className="flex space-x-2">
          {content.length > 0 && (
            <>
            <button
              onClick={handleUpload}
              disabled={isConverting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Uploading.....
                </>
              ) : (
                <>
                  <Upload className="-ml-1 mr-2 h-4 w-4" />
                  Upload PDF
                </>
              )}
            </button>
          </>
          )}
          <Button>Choose from files</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Converting PDF...</span>
        </div>
      ) : content.length > 0 ? (
        <MarkdownEditor
          content={content}
          onChange={setContent}
        />
      ) : null}
    </div>
  );
};

export default PDFMarkdownConverter