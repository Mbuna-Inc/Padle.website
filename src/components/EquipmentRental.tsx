
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface Equipment {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  inStock: number;
}

interface EquipmentRentalProps {
  selectedEquipment: any[];
  onChange: (equipment: any[]) => void;
}

const equipment: Equipment[] = [
  {
    id: 1,
    name: "Professional Tennis Racket",
    price: 15,
    description: "High-quality racket for competitive play",
    category: "Tennis",
    image: "/placeholder.svg",
    inStock: 12
  },
  {
    id: 2,
    name: "Tennis Ball Set (3 balls)",
    price: 5,
    description: "Official tournament grade tennis balls",
    category: "Tennis",
    image: "/placeholder.svg",
    inStock: 25
  },
  {
    id: 3,
    name: "Badminton Racket",
    price: 12,
    description: "Lightweight carbon fiber racket",
    category: "Badminton",
    image: "/placeholder.svg",
    inStock: 8
  },
  {
    id: 4,
    name: "Shuttlecock Set",
    price: 8,
    description: "Professional feather shuttlecocks",
    category: "Badminton",
    image: "/placeholder.svg",
    inStock: 15
  },
  {
    id: 5,
    name: "Basketball",
    price: 6,
    description: "Official size and weight basketball",
    category: "Basketball",
    image: "/placeholder.svg",
    inStock: 10
  },
  {
    id: 6,
    name: "Volleyball",
    price: 6,
    description: "Professional indoor volleyball",
    category: "Volleyball",
    image: "/placeholder.svg",
    inStock: 8
  }
];

export const EquipmentRental = ({ selectedEquipment, onChange }: EquipmentRentalProps) => {
  const updateQuantity = (equipmentId: number, change: number) => {
    const existing = selectedEquipment.find(item => item.id === equipmentId);
    const equipment_item = equipment.find(item => item.id === equipmentId);
    
    if (!equipment_item) return;
    
    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        onChange(selectedEquipment.filter(item => item.id !== equipmentId));
      } else if (newQuantity <= equipment_item.inStock) {
        onChange(selectedEquipment.map(item =>
          item.id === equipmentId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } else if (change > 0) {
      onChange([...selectedEquipment, { ...equipment_item, quantity: 1 }]);
    }
  };

  const getQuantity = (equipmentId: number) => {
    const item = selectedEquipment.find(item => item.id === equipmentId);
    return item ? item.quantity : 0;
  };

  const categories = [...new Set(equipment.map(item => item.category))];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Equipment Rental (Optional)</h3>
      
      {categories.map(category => (
        <div key={category}>
          <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {equipment
              .filter(item => item.category === category)
              .map((item) => {
                const quantity = getQuantity(item.id);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-emerald-600">
                              ${item.price}/hour
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {item.inStock} available
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={quantity === 0}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={quantity >= item.inStock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
      
      {selectedEquipment.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No equipment selected. You can add equipment to enhance your game experience.</p>
        </div>
      )}
    </div>
  );
};
