
import { useState } from "react";
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection onBookNow={handleBookNow} />
        </div>
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
