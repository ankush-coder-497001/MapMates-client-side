import { Send, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FloatingTags from "./FloatingTags";
import { MentionsInput, Mention } from "react-mentions";
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from "../socketContext";

export default function InputPanel({ onSendMessage, memberList = [], user }) {
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const socket = useSocket()

  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, selectedTag);
      setMessage("");
      setSelectedTag(null);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const handleEmojiSelect = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const mentionData = memberList.map((member) => ({
    id: member._id,
    display: member.name,
  }));

  return (
    <div className="sticky bottom-0 left-0 right-0 backdrop-blur-md bg-gradient-to-b from-transparent to-black/20 p-4 shadow-2xl z-10">
      <div className="w-full mx-auto space-y-4">
        {/* Floating Tags */}
        <FloatingTags onTagSelect={handleTagSelect} selectedTag={selectedTag} />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center justify-between space-x-4">
          {/* Emoji Button - now outside input */}
          <div className=" sm:flex  relative hidden items-center">
            <button
              type="button"
              ref={buttonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20 border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 mr-2 text-2xl md:text-2xl sm:p-2 sm:text-xl sm:min-w-[36px] sm:min-h-[36px]"
              style={{ minWidth: 44, minHeight: 44, cursor: 'pointer' }}
              tabIndex={0}
              aria-label="Open emoji picker"
            >
              <Smile className="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5 text-[#E50914]" />
            </button>
            {showEmojiPicker && (
              <div ref={pickerRef} className="absolute left-0 bottom-full mb-2 z-30">
                <EmojiPicker
                  onEmojiClick={(emojiObject) => handleEmojiSelect(emojiObject)}
                  theme="dark"
                  searchDisabled={false}
                  skinTonesDisabled={false}
                  lazyLoadEmojis={true}
                />

              </div>
            )}
          </div>
          {/* Input Field */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-[#150708] to-rose-600/10 border border-[#E50914]/20"></div>
            <div className="relative z-10">
              <MentionsInput
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  socket.current.emit("typing", { username: user.name, status: e.target.value.length > 0 });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    // Prevent default behavior of Enter key
                    e.preventDefault();
                    socket.current.emit("typing", { username: user.name, status: false });
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message and @mention..."
                className="mentions-input"
                allowSpaceInQuery={true}
                style={{
                  control: {
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#f3f4f6",
                    borderRadius: "1rem",
                    padding: "1rem 1.25rem",
                    fontSize: "1rem",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    width: "100%",
                    minHeight: "3.5rem",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "all 0.3s ease",
                    position: "relative",
                  },
                  highlighter: {
                    padding: "1rem 1.25rem",
                    fontSize: "1rem",
                    color: "#f3f4f6",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    borderRadius: "1rem",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  },
                  input: {
                    margin: 0,
                    padding: "1rem 1.25rem",
                    fontSize: "1rem",
                    color: "#f3f4f6",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    borderRadius: "1rem",
                    resize: "none",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  },
                  suggestions: {
                    list: {
                      backgroundColor: "rgba(31, 41, 55, 0.95)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "1rem",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(229,9,20,0.1)",
                      color: "#f3f4f6",
                      zIndex: 1000,
                      overflow: "auto",
                      marginTop: "0",
                      maxHeight: "300px",
                      position: "absolute",
                      width: "240px",
                      left: "1px",
                      right: "1px",
                      scrollBehavior: "smooth",
                    },
                    item: {
                      padding: "2px 12px",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "inherit",
                      color: "#f3f4f6",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    itemFocused: {
                      backgroundColor: "rgba(229,9,20,0.6)",
                      color: "white",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      outline: "none",
                    },
                  },
                }}
                forceSuggestionsAboveCursor={false}
              >
                <Mention
                  trigger="@"
                  data={mentionData}
                  markup="@[__display__](__id__)"
                  displayTransform={(id, display) => `@${display}`}
                  renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                    <div className={`flex items-center space-x-3 ${focused ? "bg-red-600" : ""}`}>
                      <div className="w-12 h-8 bg-gradient-to-br from-[#E50914] to-rose-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {suggestion.display.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 truncate">{highlightedDisplay}</span>
                    </div>
                  )}
                  style={{
                    backgroundColor: "rgba(229,9,20,0.15)",
                    color: "#fca5a5",
                    padding: "0.125rem 0.375rem",
                    borderRadius: "0.375rem",
                    fontWeight: "600",
                    border: "1px solid rgba(229,9,20,0.3)",
                  }}
                />
              </MentionsInput>
            </div>

            {/* Tag Badge */}
            {selectedTag && (
              <div className="absolute top-0 left-5 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E50914] to-rose-600 text-white shadow-lg z-20">
                {selectedTag}
              </div>
            )}

            {/* Focus Ring Effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 opacity-0 hover:opacity-100 focus-within:opacity-100 bg-gradient-to-r from-[#E50914]/10 to-rose-600/10 border border-[#E50914]/20"></div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-4 rounded-2xl bg-gradient-to-r from-[#E50914] to-rose-600 text-white hover:from-rose-600 hover:to-[#F43F5E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 shadow-lg active:scale-95 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
