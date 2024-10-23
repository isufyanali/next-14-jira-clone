import { useQueryState, parseAsBoolean } from "nuqs"

export const useCreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
    //.withOptions({ clearOnDefault: true })
    //這行代表只有在狀態不是default時,才會顯示在路由上,若為預設值,則路由就不會額外顯示
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
