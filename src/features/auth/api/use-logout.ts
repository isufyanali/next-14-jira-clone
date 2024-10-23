import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<
  ResponseType,
  Error
  >({
    mutationFn: async() => {
      const response = await client.api.auth.logout["$post"]()

      if(!response.ok){
        throw new Error("Failed to logout")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Logged out")
      router.refresh()
      //清除所有當前帳號所使用的query
      queryClient.invalidateQueries({ queryKey: ["current"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => {
      toast.error("Failed to log out")
    }
  })

  return mutation
}
