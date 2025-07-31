import { Moon, Sun, Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

export const Header = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PixelShift
              </h1>
              <p className="text-xs text-muted-foreground">PNG to JPG Converter</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Support</span>
          </Button>
        </div>
      </div>
    </header>
  );
};