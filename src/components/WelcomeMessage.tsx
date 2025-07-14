import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const WelcomeMessage = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  
  const isNewUser = bookings.length === 0;

  if (!isNewUser) return null;

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to PlayEasy, {user?.fullName}!
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You're all set up! Start your journey by booking your first court. 
            We have premium facilities waiting for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Calendar className="w-4 h-4 mr-2" />
                Book Your First Court
              </Button>
            </Link>
            
            <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
              <MapPin className="w-4 h-4 mr-2" />
              Explore Courts
            </Button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Easy Booking</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Premium Locations</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" />
              <span>Best Experience</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 