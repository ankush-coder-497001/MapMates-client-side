import { useRef, useCallback } from "react"
import MessageBubble from "./MessageBubble"

export default function ChatPanel({
  messages,
  messagesEndRef,
  hasMore,
  fetchMoreMessages,
  chatCursor,
  loading,
}) {
  const containerRef = useRef(null)

  // Infinite scroll: load more when scrolled to top
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return
    if (containerRef.current.scrollTop < 60) {
      fetchMoreMessages()
    }
  }, [loading, hasMore, fetchMoreMessages])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20 chat-scroll min-h-0"
    >
      <div className="max-full mx-auto space-y-4 pb-4">
        {hasMore && (
          <div className="text-center text-xs text-gray-400 py-2">
            Loading more...
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            index={index}
            isAnnouncement={message.isAnnouncement || false}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
