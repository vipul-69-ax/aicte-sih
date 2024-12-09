import { useMutation } from '@tanstack/react-query'
import {createClient} from '@supabase/supabase-js'
import axios from 'axios'
import { SERVER_URL } from '@/constants/API'
import { api } from '@/lib/utils'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApplicationDocument } from '@/schemas/applicationSchema'

// Initialize Supabase client
const supabase = createClient(
    "https://lalhrowagdujluyyztsd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbGhyb3dhZ2R1amx1eXl6dHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzczMjMsImV4cCI6MjA0ODkxMzMyM30.0WmOp9pbjZsQ4RFGeJmtQMatsJjrzKm3NoXDXu587BE"
)

interface UploadResult {
  downloadUrl: string
}

export function useFileUpload() {
  return useMutation<UploadResult, Error, File>({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name}_${Math.random().toString(36)}`
      const { data, error } = await supabase.storage
        .from('sih')
        .upload(fileName, file)

      if (error) {
        throw new Error(error.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('sih')
        .getPublicUrl(data.path)

      return { downloadUrl: publicUrl }
    },
  })
}

type VerifyBody = {
  uni_doc_uri: string,
  doc_id: string,
  formatId: string,
    uni_application_id:string,
}

export function useFileVerification() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (verifyBody: VerifyBody)=>{
            const req = await api.post(`${SERVER_URL}/institute/data/document_analysis`,verifyBody)
            return req.data
        },
    onSuccess: (data) => {
      navigate("/institute/error-fix", { state: { currentUniDoc: [data.data.currentUniDoc] } });
        },
        onError:(err)=>{
            alert(JSON.stringify(err.message))
        }
    })
}