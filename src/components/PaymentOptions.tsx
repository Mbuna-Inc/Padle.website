
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smartphone, CreditCard, Building, HandCoins } from "lucide-react";

interface PaymentOptionsProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const paymentMethods = [
  {
    id: "airtel-money",
    name: "Airtel Money",
    description: "Pay securely with your Airtel Money wallet",
    icon: Smartphone,
    popular: true
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    description: "Direct bank transfer (manual confirmation required)",
    icon: Building,
    popular: false
  },
  {
    id: "pos",
    name: "Point of Sale (POS)",
    description: "Pay in person at the venue",
    icon: CreditCard,
    popular: false
  },
  {
    id: "manual",
    name: "Manual Payment",
    description: "Admin will manually update payment status",
    icon: HandCoins,
    popular: false
  }
];

export const PaymentOptions = ({ selectedMethod, onChange }: PaymentOptionsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Choose Payment Method</h3>
      
      <RadioGroup value={selectedMethod} onValueChange={onChange} className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="relative">
            <Label
              htmlFor={method.id}
              className="cursor-pointer block"
            >
              <Card className={`hover:shadow-md transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'ring-2 ring-emerald-500 bg-emerald-50'
                  : 'hover:bg-gray-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === method.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{method.name}</h4>
                        {method.popular && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Payment Method Details */}
      {selectedMethod && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
            {selectedMethod === "airtel-money" && (
              <div className="text-sm text-blue-800">
                <p>• You will be redirected to Airtel Money to complete payment</p>
                <p>• Keep your phone handy for USSD confirmation</p>
                <p>• Payment confirmation is instant</p>
              </div>
            )}
            {selectedMethod === "bank-transfer" && (
              <div className="text-sm text-blue-800">
                <p>• Bank details will be provided after booking</p>
                <p>• Include booking reference in transfer description</p>
                <p>• Manual confirmation may take 1-2 hours</p>
              </div>
            )}
            {selectedMethod === "pos" && (
              <div className="text-sm text-blue-800">
                <p>• Pay at the venue before your booking time</p>
                <p>• POS terminal available at reception</p>
                <p>• Bring your booking confirmation</p>
              </div>
            )}
            {selectedMethod === "manual" && (
              <div className="text-sm text-blue-800">
                <p>• Contact admin to arrange payment</p>
                <p>• Payment status will be updated manually</p>
                <p>• Allow extra time for confirmation</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
