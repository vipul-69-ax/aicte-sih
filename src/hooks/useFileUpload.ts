import { useMutation } from '@tanstack/react-query'
import {createClient} from '@supabase/supabase-js'
import axios from 'axios'
import { SERVER_URL } from '@/constants/API'
import { api } from '@/lib/utils'

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
    fileUrl:string,
    formatId:string
}

export function useFileVerification(){
    return useMutation({
        mutationFn:async(verifyBody:VerifyBody)=>{
            const req = await api.post(`${SERVER_URL}/institute/data/document_analysis`,verifyBody)
            console.log(req.data)
            return req.data
        },
        onSuccess:(data)=>{
        },
        onError:(err)=>{
            alert(JSON.stringify(err.message))
        }
    })
}