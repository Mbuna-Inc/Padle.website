
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";

interface HeroSectionProps {
  onBookNow: () => void;
}

export const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-blue-100"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Book Your Perfect
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent block">
              Court Experience
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover premium courts, rent professional equipment, and enjoy seamless booking 
            with flexible payment options. Your game starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
            <Button 
              onClick={onBookNow}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Book Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Find Courts
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Instant Booking</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Real-time availability check</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Premium Locations</h3>
              <p className="text-gray-600 text-xs sm:text-sm">50+ courts across the city</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Flexible Payment</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Multiple payment options</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
