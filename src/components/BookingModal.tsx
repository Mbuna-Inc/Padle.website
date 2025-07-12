
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Book {court.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 px-4">
              {[
                { num: 1, label: "Date & Time", icon: Calendar },
                { num: 2, label: "Equipment", icon: HandCoins },
                { num: 3, label: "Payment", icon: CreditCard },
                { num: 4, label: "Confirm", icon: Clock }
              ].map((stepItem, index) => (
                <div key={stepItem.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                      step >= stepItem.num 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-110' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <stepItem.icon className="w-7 h-7" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className={`text-sm font-medium ${
                        step >= stepItem.num ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        Step {stepItem.num}
                      </div>
                      <div className={`text-xs mt-1 ${
                        step >= stepItem.num ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                        {stepItem.label}
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${
                      step > stepItem.num ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="px-2">
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
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold mb-6">Booking Confirmation</h3>
                  
                  <Card className="border-2">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Booking Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Court:</span>
                        <span className="font-medium">{court.name}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedDate?.toDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{paymentMethod}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedEquipment.length > 0 && (
                    <Card className="border-2">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Equipment Rental</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedEquipment.map((item, index) => (
                          <div key={index} className="flex justify-between py-2">
                            <span>{item.name} x{item.quantity}</span>
                            <span>MK{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span>Court ({duration}h)</span>
                    <span>MK{courtPrice * duration}</span>
                  </div>
                  
                  {selectedEquipment.map((item, index) => (
                    <div key={index} className="flex justify-between text-base">
                      <span>{item.name} x{item.quantity}</span>
                      <span>MK{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-base">
                    <span>Subtotal</span>
                    <span>MK{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span>Tax (10%)</span>
                    <span>MK{tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>MK{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t">
                  {selectedDate && (
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{selectedDate.toDateString()}</span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{selectedTime} ({duration}h)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t-2 mt-8">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handlePrevious}
            className="px-8 py-3 text-base"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={step === 4 ? handleBooking : handleNext}
            disabled={
              (step === 1 && (!selectedDate || !selectedTime)) ||
              (step === 3 && !paymentMethod)
            }
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-3 text-base"
          >
            {step === 4 ? 'Complete Booking' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
