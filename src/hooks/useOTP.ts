import { SERVER_URL } from "@/constants/API";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./use-toast";
import { queryClient } from "@/App";

export const useOtp = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (formData: { email: string }) => {
      const res = await axios.post(`${SERVER_URL}/otp`, formData);
      return res.data;
    },
    mutationKey: ["otp"],
    onSuccess: (data) => {
      if (!data.success) {
        toast({ title: "Cannot send otp." });
      }
      queryClient.invalidateQueries({ queryKey: ["otp"] });
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      toast({ title: "Cannot send otp." });
      queryClient.cancelQueries({ queryKey: ["otp"] });
      console.error("Registration failed:", error);
    },
  });
};
