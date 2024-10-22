import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    //這裡需要node > v20 才能執行
    //在 Node.js 18 中，File 是一個在瀏覽器中存在的對象，並不是 Node.js 的內置對象
    //因此，在 Node.js 18 中使用 z.instanceof(File) 會導致 File is not defined 錯誤
    //要在 Node.js 中處理文件上傳，通常會使用類似 Buffer、Stream 或通過 multer 等中間件來處理文件，而不是直接使用 File。
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value)
  ])
  .optional(),
})