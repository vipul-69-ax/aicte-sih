import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useInstituteValidation } from '@/hooks/useInstituteValidation'

const rules = [
  "At least 5 institute images must be uploaded (classrooms, corridors, etc.).",
  "All images must be clear and recent (not older than 3 months).",
  "Blueprints must include layouts for classrooms, corridors, washrooms, and other key areas.",
  "All files (images and blueprints) must be in PNG format.",
  "File size should not exceed 5MB per image or blueprint.",
  "Blueprints must clearly label all areas and include dimensions.",
]

export default function AICTEVerificationPage() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState(null)
  const [selectedType, setSelectedType] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0])
      setDialogOpen(true)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCurrentFile(e.dataTransfer.files[0])
      setDialogOpen(true)
    }
  }

  const addFile = () => {

    const newFile = { file: currentFile, type: selectedType }
    const updatedFiles = [...files, newFile]
    const imageCount = updatedFiles.filter(f => f.type === 'institute_image').length
    const blueprintCount = updatedFiles.filter(f => f.type === 'blueprint').length
    
    if (imageCount < 5) {
      setError('Please upload at least 5 institute images.')
    } else if (blueprintCount === 0) {
      setError('Please upload at least one blueprint.')
    } else {
      setError(null)
    }

    setFiles(updatedFiles)
    setDialogOpen(false)
    setSelectedType('')
  }
  const {mutateAsync, isPending, data} = useFileUpload()
  const {mutateAsync:validate, isPending:loading, data:is_validated} = useInstituteValidation()
  const handleSubmit = (e) => {
    e.preventDefault()
    let blueprints = files.map(i=>{return i.type==="blueprint"?i.file:undefined}).filter(i=>i)
    let institute = files.map(i=>{return i.type!=="blueprint"?i.file:undefined}).filter(i=>i)
    blueprints.map(async(img)=>{
        console.log(img)
        const resp = await mutateAsync(img)
        alert(resp?.downloadUrl)
        if(resp?.downloadUrl){
            const _r = await validate(resp?.downloadUrl)
            console.log(_r)
        }
    })
    
    // Add your submission logic here
  }

  const renderFiles = () => {
    return files.map((file, index) => (
      <motion.div
        key={index}
        className="relative w-full h-48"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <img
          src={URL.createObjectURL(file.file)}
          alt={`${file.type} ${index + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {file.type === 'institute_image' ? 'Institute Image' : 'Blueprint'}
        </div>
      </motion.div>
    ))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">AICTE Infrastructure Verification</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {rules.map((rule, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {rule}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Institute Images and Blueprints</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className={`mt-2 p-4 border-2 border-dashed rounded-md ${
                dragOver ? 'border-primary' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Input
                id="fileUpload"
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="fileUpload" className="cursor-pointer block text-center">
                {files.length > 0 ? `${files.length} files selected` : 'Click or drag to upload images and blueprints'}
              </Label>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Upload at least 5 institute images and blueprints of classrooms, corridors, washrooms, etc. (PNG format only)
              </p>
            </motion.div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {renderFiles()}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Submit Verification</Button>
      </motion.form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Image Type</DialogTitle>
          </DialogHeader>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select image type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="institute_image">Institute Image</SelectItem>
              <SelectItem value="blueprint">Blueprint</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={addFile} disabled={!selectedType}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

