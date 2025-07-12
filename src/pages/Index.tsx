
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Trophy, Users, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BookingModal } from "@/components/BookingModal";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Single court data
  const court = {
    id: 1,
    name: "Premium Multi-Sport Court",
    type: "Tennis/Badminton/Basketball",
    location: "Downtown Sports Complex",
    price: 50,
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    features: ["Air Conditioning", "Professional Lighting", "Wi-Fi", "Parking", "Equipment Rental", "Sound System"],
    availability: "Available Now",
    nextSlot: "Next available: 2:00 PM - 3:00 PM"
  };

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Navigation onLogin={handleLogin} />
      
      <main className="pt-16">
        <HeroSection onBookNow={handleBookNow} />
        
        {/* Features Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PlayEasy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the easiest way to book our premium court
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time Booking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  See live court availability and book instantly with our color-coded time slot system
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Equipment Rental</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Rent professional equipment including rackets, balls, and more during booking
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Flexible Payments</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Multiple payment options including Airtel Money, bank transfer, and POS
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Single Court Section */}
        <section id="court" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Premium Court
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Book our state-of-the-art multi-sport facility
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white overflow-hidden">
              <div className="relative">
                <img 
                  src={court.image} 
                  alt={court.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {court.availability}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 text-gray-900 font-bold px-3 py-1 rounded-full">
                    ${court.price}/hr
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-2xl group-hover:text-emerald-600 transition-colors">
                    {court.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{court.rating}</span>
                    <span className="text-gray-500">({court.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{court.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{court.nextSlot}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {court.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={handleBookNow}
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                >
                  Book Now - Real-Time Availability
                </Button>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="text-emerald-100">Premium Court</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-emerald-100">Happy Players</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-emerald-100">Support</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-emerald-100">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        court={court}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;
