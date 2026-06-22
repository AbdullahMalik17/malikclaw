interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex w-full flex-col items-end gap-1.5">
      <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-500 to-purple-600 px-5 py-3 text-[15px] leading-relaxed text-white shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)]">
        {content}
      </div>
    </div>
  )
}
