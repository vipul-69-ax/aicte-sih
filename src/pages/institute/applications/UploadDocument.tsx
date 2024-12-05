'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Upload, AlertTriangle } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'

export default function UploadLegalDocument() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const { mutate: uploadFile, isPending, isSuccess, isError, error, data } = useFileUpload()

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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Legal Document</CardTitle>
        </CardHeader>
        <CardContent>
          {!file && (
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>
          )}
          {pdfUrl && (
            <div className="mt-4">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] border border-gray-300 rounded"
                title="PDF Preview"
              />
            </div>
          )}
          {isSuccess && data && (
            <Alert className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your document has been successfully uploaded. 
                <a href={data.downloadUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                  View uploaded file
                </a>
              </AlertDescription>
            </Alert>
          )}
          {isError && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error?.message || 'An error occurred during upload.'}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {file && !isSuccess && (
              <>
                <Button onClick={handleUpload} disabled={isPending}>
                  {isPending ? 'Uploading...' : 'Upload Document'}
                </Button>
              </>
            )}
            {(file || isSuccess) && (
              <Button variant="destructive" disabled={isPending} onClick={handleCancel} className="ml-2">
                Cancel
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      <ForgeryGuidelines />
    </div>
  )
}

function ForgeryGuidelines() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          Guidelines Against Forgery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
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

