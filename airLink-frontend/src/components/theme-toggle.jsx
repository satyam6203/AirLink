import { Moon, Sun, Palette, Leaf, Zap, Wine, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"

const themeConfig = {
  light: {
    label: "Light",
    icon: Sun,
    description: "Light background"
  },
  dark: {
    label: "Dark", 
    icon: Moon,
    description: "Dark background with gradient"
  }
}
const theams=["light", "dark"]
export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const currentTheme = themeConfig[theme]
  const CurrentIcon = currentTheme?.icon || Palette

  const handleThemeChange = (themeName) => {
    setTheme(themeName)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentTheme?.label}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Choose Theme
          </div>
          
          {/* Background Themes */}
          <div className="px-2 py-1 text-xs text-muted-foreground font-medium">
            Background
          </div>
          {theams.map((themeName) => {
            const config = themeConfig[themeName]
            const Icon = config.icon
            return (
              <button
                key={themeName}
                onClick={() => handleThemeChange(themeName)}
                className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  theme === themeName ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <div>{config.label}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </div>
                {theme === themeName && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </button>
            )
          })}
          
          <div className="border-t border-border my-2"></div>
          
          
        </div>
        
        <div className="mt-3 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground px-2">
            Theme preferences are saved automatically
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
