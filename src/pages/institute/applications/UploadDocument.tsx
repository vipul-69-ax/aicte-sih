'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, AlertTriangle, FileText, CheckCircle, Loader } from 'lucide-react'
import { useFileUpload, useFileVerification } from '@/hooks/useFileUpload'
import { useLocation, useNavigate } from 'react-router-dom'
import VerificationPopup from '@/components/VerificationPopup'

export default function UploadLegalDocument() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { doc } = useLocation().state
  const { mutate: uploadFile, isPending, isSuccess, isError, error, data } = useFileUpload()
  const { mutate: verifyFile, isPending: isVerifying, isSuccess: isVerifyingSuccess, data: errorData } = useFileVerification()
  const navigate = useNavigate()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPdfUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = () => {
    if (file) {
      uploadFile(file)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setPdfUrl(null)
  }

  useEffect(() => {
    if (data?.downloadUrl) {
      verifyFile({
        fileUrl: data?.downloadUrl as string,
        formatId: doc.uni_doc_uri
      })
    }
  }, [data])

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="w-full md:w-2/3 shadow-lg">
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-2xl font-bold">Upload {doc.uni_doc_name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!file && (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              )}
              {pdfUrl && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <FileText className="mr-2 text-gray-500" />
                    <span className="font-semibold">{file?.name}</span>
                  </div>
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[600px] border rounded"
                    title="PDF Preview"
                  />
                </div>
              )}
              {isSuccess && data && (
                <Alert className="mt-4 bg-green-50 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Success</AlertTitle>
                  <AlertDescription className="text-green-600">
                    Your document has been successfully uploaded. 
                    <a href={data.downloadUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1 font-bold">
                      View uploaded file
                    </a>
                  </AlertDescription>
                </Alert>
              )}
              {isError && (
                <Alert className="mt-4 bg-red-50 border-red-500">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="text-red-700">Error</AlertTitle>
                  <AlertDescription className="text-red-600">{error?.message || 'An error occurred during upload.'}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50">
              <div>
                {file && !isSuccess && (
                  <Button onClick={handleUpload} disabled={isPending} className="bg-black text-white hover:bg-gray-800">
                    {isPending ? 'Uploading...' : 'Upload Document'}
                  </Button>
                )}
                {(file || isSuccess) && (
                  <Button variant="outline" disabled={isPending} onClick={handleCancel} className="ml-2">
                    Cancel
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
          <ForgeryGuidelines />
        </div>
      </div>
      {isSuccess && (isVerifying || isVerifyingSuccess) && (
        <VerificationPopup 
          isVerifying={isVerifying} 
          isVerifyingSuccess={isVerifyingSuccess} 
          errorData={errorData} 
          onCancel={()=>{
            navigate("/institute/applications")
          }}
        />
      )}
    </div>
  )
}

function ForgeryGuidelines() {
  return (
    <Card className="w-full md:w-1/3 shadow-lg">
      <CardHeader className="bg-black text-white">
        <CardTitle className="text-xl font-bold flex items-center">
          <AlertTriangle className="mr-2" />
          Guidelines Against Forgery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Ensure all documents are original and unaltered.</li>
          <li>Do not attempt to modify or falsify any information within the document.</li>
          <li>Verify that all signatures and seals are authentic and belong to the appropriate parties.</li>
          <li>Check that dates, names, and other critical information are accurate and consistent throughout the document.</li>
          <li>If you suspect a document may be forged or altered, report it immediately to the relevant authorities.</li>
          <li>Be aware that submitting forged documents is a serious criminal offense with severe legal consequences.</li>
        </ul>
      </CardContent>
    </Card>
  )
}

