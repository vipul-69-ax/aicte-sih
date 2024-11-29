'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocumentGet } from '@/hooks/useApplication'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, Eye } from 'lucide-react'
import { PDFViewer } from '@/components/PdfViewer'

export default function ApplicationDashboard() {
  const { id } = useParams()
  const { mutateAsync: getDocument, isPending } = useDocumentGet()
  const [documentData, setDocumentData] = useState<any>()

  useEffect(() => {
    const getDocumentAsync = async () => {
      if (!id) return
      const data = await getDocument(id as string)
      setDocumentData(data.data)
    }
    getDocumentAsync()
  }, [id, getDocument])

  if (isPending || !documentData) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#fff]">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader
          applicationName={documentData.application_name}
          applicationType={documentData.application_type}
        />
        <div className="grid gap-8 md:grid-cols-2">
          <DashboardSummary documentData={documentData} />
          <DocumentStatusOverview documents={documentData.documents} />
        </div>
        <DocumentList documents={documentData.documents} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

function DashboardHeader({ applicationName, applicationType }: { applicationName: string; applicationType: string }) {
  return (
    <div className="space-y-2">
      <h1 className='text-3xl font-semibold text-[#2c3e50]'>{applicationName}</h1>
      <p className="text-[#7f8c8d] text-sm">{applicationType}</p>
      <Separator className="my-4" />
    </div>
  )
}

function DashboardSummary({ documentData }: { documentData: any }) {
  const totalDocuments = documentData.documents.length
  const approvedDocuments = documentData.documents.filter((doc: any) => doc.status === 'approved').length

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#2c3e50] text-xl">Application Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#7f8c8d]">Total Documents</span>
          <span className="text-2xl font-bold text-[#3498db]">{totalDocuments}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#7f8c8d]">Approved Documents</span>
          <span className="text-2xl font-bold text-[#2ecc71]">{approvedDocuments}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#7f8c8d]">Completion</span>
          <span className="text-2xl font-bold text-[#e74c3c]">{Math.round((approvedDocuments / totalDocuments) * 100)}%</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentStatusOverview({ documents }: { documents: any[] }) {
  const statusCounts = documents.reduce((acc: any, doc: any) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#2c3e50] text-xl">Document Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function DocumentList({ documents }: { documents: any[] }) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState('')

  const sortedAndFilteredDocuments = documents
    .filter((doc) =>
      doc.document_name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleUpload = async (documentId: string, file: File) => {
    // TODO: Implement actual file upload logic
    console.log(`Uploading file for document ${documentId}:`, file.name)
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter documents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('document_name')} className="cursor-pointer text-[#2c3e50]">
              Document Name
            </TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-[#2c3e50]">
              Status
            </TableHead>
            <TableHead className="text-[#2c3e50]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredDocuments.map((doc) => (
            <TableRow key={doc.document_id}>
              <TableCell className="font-medium text-[#34495e]">{doc.document_name}</TableCell>
              <TableCell>
                <Badge>
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-[#3498db] border-[#3498db] hover:bg-[#3498db] hover:text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription>
                          Upload a file for {doc.document_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor={`file-upload-${doc.document_id}`}>File</Label>
                        <Input
                          id={`file-upload-${doc.document_id}`}
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleUpload(doc.document_id, file)
                            }
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-[#2ecc71] border-[#2ecc71] hover:bg-[#2ecc71] hover:text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Format
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Document Format</DialogTitle>
                        <DialogDescription>
                          Format details for {doc.document_name}
                        </DialogDescription>
                      </DialogHeader>
                      <PDFViewer
                        pdfPath={doc.format_uri}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

