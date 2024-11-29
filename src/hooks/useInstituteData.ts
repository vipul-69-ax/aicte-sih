import { queryClient } from "@/App";
import { SERVER_URL } from "@/constants/API";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useInstituteData = () => {
  const { toast } = useToast();
  const nav = useNavigate();

  const mutation = useMutation({
    mutationKey: ["institute-data"],
    mutationFn: async (instituteId: string) => {
      const res = await axios.post(
        `${SERVER_URL}/institute/data`,{
          instituteId
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
    },
    onError: (error) => {
      toast({
        description: error.message,
        onClick: () => {
        },
      });
      console.error("Failed to fetch institute data:", error);
    },
    retry:3
  });

  return mutation;
};


export {useInstituteData}

interface InstituteState {
  instituteId: string | null
  setInstituteId: (id: string) => void
  clearInstituteId: () => void
}

export const useInstituteStore = create<InstituteState>()(
  persist(
    (set) => ({
      instituteId: null,
      setInstituteId: (id: string) => set({ instituteId: id }),
      clearInstituteId: () => set({ instituteId: null }),
    }),
    {
      name: 'institute-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
