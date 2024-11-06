import { useQueryState, parseAsBoolean } from "nuqs"

export const useCreateTaskModal = () => {
  //如果要額外傳入別的參數判斷開啟的預設值,例如status
  //使用useQueryStates

  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    open,
    close,
    setIsOpen
  }
}
