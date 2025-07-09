
import { HelpCircle, AlertTriangle, Newspaper } from "lucide-react"

export default function FloatingTags({ onTagSelect, selectedTag }) {
  const tags = [
    { name: "Help", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500", icon: HelpCircle },
    { name: "Emergency", color: "from-red-500 to-red-600", bgColor: "bg-red-500", icon: AlertTriangle },
    { name: "News", color: "from-amber-500 to-yellow-500", bgColor: "bg-amber-500", icon: Newspaper },
  ]

  return (
    <div className="flex justify-center space-x-4">
      {tags.map((tag, index) => {
        const Icon = tag.icon
        return (
          <button
            key={tag.name}
            onClick={() => onTagSelect(selectedTag === tag.name ? null : tag.name)}
            className={`
              cursor-pointer
              flex items-center space-x-2 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:shadow-xl
              animate-bounce shadow-lg font-medium text-sm
              ${selectedTag === tag.name
                ? `bg-gradient-to-r ${tag.color} border-white/50 shadow-xl text-white`
                : "bg-white/6 border-white/20 hover:bg-rose-500/20 text-gray-100 hover:text-white hover:border-rose-500/30"
              }
            `}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: "2s",
              animationIterationCount: "infinite",
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{tag.name}</span>
          </button>
        )
      })}
    </div>
  )
}
