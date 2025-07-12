
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Wifi, Car, Zap } from "lucide-react";

interface CourtGridProps {
  onBookCourt: (court: any) => void;
}

const courts = [
  {
    id: 1,
    name: "Premium Tennis Court A",
    type: "Tennis",
    location: "Downtown Sports Complex",
    price: 50,
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    features: ["Air Conditioning", "Lighting", "Wi-Fi", "Parking"],
    availability: "Available Now",
    nextSlot: "2:00 PM - 3:00 PM"
  },
  {
    id: 2,
    name: "Badminton Court B",
    type: "Badminton",
    location: "Central Recreation Center",
    price: 35,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg",
    features: ["Wooden Floor", "Lighting", "Equipment Rental"],
    availability: "Available from 3 PM",
    nextSlot: "3:00 PM - 4:00 PM"
  },
  {
    id: 3,
    name: "Multi-Purpose Court C",
    type: "Basketball/Volleyball",
    location: "University Sports Center",
    price: 40,
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg",
    features: ["High Ceiling", "Sound System", "Scoreboard"],
    availability: "Available Now",
    nextSlot: "1:30 PM - 2:30 PM"
  },
  {
    id: 4,
    name: "Professional Tennis Court D",
    type: "Tennis",
    location: "Elite Sports Club",
    price: 75,
    rating: 5.0,
    reviews: 67,
    image: "/placeholder.svg",
    features: ["Clay Surface", "Stadium Seating", "Professional Grade"],
    availability: "Available from 4 PM",
    nextSlot: "4:00 PM - 5:00 PM"
  },
  {
    id: 5,
    name: "Indoor Squash Court E",
    type: "Squash",
    location: "Metropolitan Sports Hub",
    price: 45,
    rating: 4.6,
    reviews: 92,
    image: "/placeholder.svg",
    features: ["Glass Back Wall", "Climate Control", "Viewing Area"],
    availability: "Available Now",
    nextSlot: "2:30 PM - 3:30 PM"
  },
  {
    id: 6,
    name: "Outdoor Basketball Court F",
    type: "Basketball",
    location: "Community Sports Park",
    price: 25,
    rating: 4.4,
    reviews: 78,
    image: "/placeholder.svg",
    features: ["Full Court", "Outdoor", "Floodlights"],
    availability: "Available from 5 PM",
    nextSlot: "5:00 PM - 6:00 PM"
  }
];

const getFeatureIcon = (feature: string) => {
  switch (feature.toLowerCase()) {
    case 'wi-fi':
      return <Wifi className="w-4 h-4" />;
    case 'parking':
      return <Car className="w-4 h-4" />;
    case 'lighting':
    case 'floodlights':
      return <Zap className="w-4 h-4" />;
    default:
      return <Star className="w-4 h-4" />;
  }
};

export const CourtGrid = ({ onBookCourt }: CourtGridProps) => {
  const [filter, setFilter] = useState("All");
  
  const courtTypes = ["All", "Tennis", "Badminton", "Basketball", "Squash"];
  
  const filteredCourts = filter === "All" 
    ? courts 
    : courts.filter(court => court.type.includes(filter));

  return (
    <section id="courts" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Available Courts
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Choose from our premium selection of courts
        </p>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {courtTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              onClick={() => setFilter(type)}
              className={`rounded-full ${filter === type 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourts.map((court) => (
          <Card 
            key={court.id} 
            className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white overflow-hidden"
          >
            <div className="relative">
              <img 
                src={court.image} 
                alt={court.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="secondary" 
                  className={`${court.availability.includes('Now') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {court.availability}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-900 font-bold">
                  ${court.price}/hr
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                  {court.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{court.rating}</span>
                  <span className="text-sm text-gray-500">({court.reviews})</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{court.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Next: {court.nextSlot}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {court.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </div>
                ))}
                {court.features.length > 3 && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    +{court.features.length - 3} more
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => onBookCourt(court)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 group-hover:shadow-lg"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
