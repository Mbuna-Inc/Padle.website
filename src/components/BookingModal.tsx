
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, Smartphone, Building, HandCoins } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";
import { EquipmentRental } from "@/components/EquipmentRental";
import { PaymentOptions } from "@/components/PaymentOptions";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: any;
}

export const BookingModal = ({ isOpen, onClose, court }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const courtPrice = court?.price || 50;
  const equipmentTotal = selectedEquipment.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = (courtPrice * duration) + equipmentTotal;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = () => {
    // Handle booking submission
    console.log({
      court,
      date: selectedDate,
      time: selectedTime,
      duration,
      equipment: selectedEquipment,
      paymentMethod,
      total
    });
    // Reset and close
    setStep(1);
    onClose();
  };

  if (!court) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book {court.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[
                { num: 1, label: "Date & Time", icon: Calendar },
                { num: 2, label: "Equipment", icon: HandCoins },
                { num: 3, label: "Payment", icon: CreditCard },
                { num: 4, label: "Confirm", icon: Clock }
              ].map((stepItem, index) => (
                <div key={stepItem.num} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepItem.num 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <stepItem.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step >= stepItem.num ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      step > stepItem.num ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {step === 1 && (
              <BookingCalendar
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                duration={duration}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                onDurationChange={setDuration}
              />
            )}

            {step === 2 && (
              <EquipmentRental
                selectedEquipment={selectedEquipment}
                onChange={setSelectedEquipment}
              />
            )}

            {step === 3 && (
              <PaymentOptions
                selectedMethod={paymentMethod}
                onChange={setPaymentMethod}
              />
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Booking Confirmation</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Court:</span>
                      <span className="font-medium">{court.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate?.toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium">{paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>

                {selectedEquipment.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Equipment Rental</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEquipment.map((item, index) => (
                        <div key={index} className="flex justify-between py-1">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Court ({duration}h)</span>
                    <span>${courtPrice * duration}</span>
                  </div>
                  
                  {selectedEquipment.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedDate.toDateString()}</span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{selectedTime} ({duration}h)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handlePrevious}
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={step === 4 ? handleBooking : handleNext}
            disabled={
              (step === 1 && (!selectedDate || !selectedTime)) ||
              (step === 3 && !paymentMethod)
            }
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {step === 4 ? 'Complete Booking' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
