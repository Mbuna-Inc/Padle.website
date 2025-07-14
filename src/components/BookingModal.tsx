
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, Smartphone, Building, HandCoins, Hash } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";
import { EquipmentRental } from "@/components/EquipmentRental";
import { PaymentOptions } from "@/components/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import { AuthGuard } from "@/components/AuthGuard";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: any;
  onLogin: () => void;
}

// Generate unique booking ID
const generateBookingId = () => {
  const prefix = "PEB";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const BookingModal = ({ isOpen, onClose, court, onLogin }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  // Generate booking ID when modal opens
  useEffect(() => {
    if (isOpen && !bookingId) {
      setBookingId(generateBookingId());
    }
  }, [isOpen, bookingId]);

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

  const handleBooking = async () => {
    if (!isAuthenticated) {
      onClose();
      onLogin();
      return;
    }

    if (!selectedDate || !selectedTime || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add booking to context
      addBooking({
        courtId: court.id,
        courtName: court.name,
        courtType: court.type,
        date: selectedDate,
        time: selectedTime,
        duration,
        totalAmount: total,
        status: 'confirmed',
        equipment: selectedEquipment,
        paymentMethod
      });

      // Add notification
      addNotification({
        title: "Booking Confirmed!",
        message: `Your booking for ${court.name} on ${selectedDate?.toLocaleDateString()} at ${selectedTime} has been confirmed.`,
        type: "success",
        actionUrl: "/profile"
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${court.name} has been confirmed.`,
      });

      // Reset and close
      setStep(1);
      setBookingId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setDuration(1);
      setSelectedEquipment([]);
      setPaymentMethod("");
      onClose();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBookingId("");
    onClose();
  };

  if (!court) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
        <AuthGuard onLogin={onLogin} message="Please sign in to book a court.">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Book {court.name}
          </DialogTitle>
          {bookingId && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <Hash className="w-4 h-4" />
              <span>Booking ID: {bookingId}</span>
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            {/* Progress Steps */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 px-2 sm:px-4 gap-4 sm:gap-0">
              {[
                { num: 1, label: "Date & Time", icon: Calendar },
                { num: 2, label: "Equipment", icon: HandCoins },
                { num: 3, label: "Payment", icon: CreditCard },
                { num: 4, label: "Confirm", icon: Clock }
              ].map((stepItem, index) => (
                <div key={stepItem.num} className="flex items-center w-full sm:w-auto">
                  <div className="flex flex-col items-center flex-1 sm:flex-initial">
                    <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full transition-all duration-300 ${
                      step >= stepItem.num 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-110' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <stepItem.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                    </div>
                    <div className="mt-2 sm:mt-3 text-center">
                      <div className={`text-xs sm:text-sm font-medium ${
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
                    <div className={`hidden sm:flex flex-1 h-1 mx-3 sm:mx-6 rounded-full transition-all duration-300 ${
                      step > stepItem.num ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="px-1 sm:px-2">
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
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">Booking Confirmation</h3>
                  
                  <Card className="border-2">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                        Booking Details
                        <Badge variant="secondary" className="text-xs">{bookingId}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                        <span className="text-gray-600">Court:</span>
                        <span className="font-medium">{court.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{paymentMethod}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedEquipment.length > 0 && (
                    <Card className="border-2">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-base sm:text-lg lg:text-xl">Equipment Rental</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm sm:text-base">
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
          <div className="xl:col-span-1 order-1 xl:order-2">
            <Card className="sticky top-4 border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Booking Summary</CardTitle>
                {bookingId && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>ID: {bookingId}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 text-sm sm:text-base">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span>Court ({duration}h)</span>
                    <span>MK{courtPrice * duration}</span>
                  </div>
                  
                  {selectedEquipment.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>MK{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <Separator className="my-3 sm:my-4" />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>MK{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>MK{tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-3 sm:my-4" />
                  
                  <div className="flex justify-between font-bold text-lg sm:text-xl">
                    <span>Total</span>
                    <span>MK{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t">
                  {selectedDate && (
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{selectedDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{selectedTime}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-6 sm:pt-8 border-t-2 mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={step === 1 ? handleClose : handlePrevious}
            className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base order-2 sm:order-1"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={step === 4 ? handleBooking : handleNext}
            disabled={
              (step === 1 && (!selectedDate || !selectedTime)) ||
              (step === 3 && !paymentMethod) ||
              isSubmitting
            }
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2"
          >
            {step === 4 ? (isSubmitting ? 'Processing...' : 'Complete Booking') : 'Next'}
          </Button>
        </div>
        </AuthGuard>
      </DialogContent>
    </Dialog>
  );
};
