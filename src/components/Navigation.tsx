
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn } from "lucide-react";

interface NavigationProps {
  onLogin: () => void;
}

export const Navigation = ({ onLogin }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PlayEasy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#courts" className="text-gray-900 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors">
                Courts
              </a>
              <a href="#equipment" className="text-gray-900 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors">
                Equipment
              </a>
              <a href="#about" className="text-gray-900 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-900 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={onLogin} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button onClick={onLogin} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#courts" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-emerald-600">
              Courts
            </a>
            <a href="#equipment" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-emerald-600">
              Equipment
            </a>
            <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-emerald-600">
              About
            </a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-emerald-600">
              Contact
            </a>
            <div className="border-t border-gray-200 pt-4">
              <Button variant="ghost" onClick={onLogin} className="w-full justify-start mb-2">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button onClick={onLogin} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
