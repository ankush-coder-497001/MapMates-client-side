import * as React from "react"

const buttonVariants = {
  variant: {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-600 bg-transparent hover:bg-gray-800 hover:text-white",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "hover:bg-gray-800 hover:text-white",
    link: "text-blue-500 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
}

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default

  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()

  return <button className={combinedClasses} ref={ref} {...props} />
})

Button.displayName = "Button"

export { Button }
