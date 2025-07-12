
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  duration: number;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: number) => void;
}

const durations = [
  { value: 1, label: "1 Hour" },
  { value: 2, label: "2 Hours" },
  { value: 3, label: "3 Hours" },
  { value: 4, label: "4 Hours" }
];

// Generate time slots based on duration
const generateTimeSlots = (duration: number) => {
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour += duration) {
    if (hour + duration <= endHour) {
      const startTime = formatTime(hour);
      const endTime = formatTime(hour + duration);
      slots.push(`${startTime} - ${endTime}`);
    }
  }
  
  return slots;
};

const formatTime = (hour: number) => {
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

// Mock booking data - in real app this would come from API
const getBookedSlots = (date: Date | undefined, duration: number) => {
  if (!date) return [];
  
  // Mock some booked slots for demonstration based on duration
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
  
  const slots = generateTimeSlots(duration);
  
  if (isToday) {
    // Mock some booked slots
    return [slots[1], slots[3]]; // Book some random slots
  } else if (isTomorrow) {
    return [slots[0]]; // Book first slot
  }
  return [];
};

export const BookingCalendar = ({
  selectedDate,
  selectedTime,
  duration,
  onDateChange,
  onTimeChange,
  onDurationChange
}: BookingCalendarProps) => {
  const timeSlots = generateTimeSlots(duration);
  const bookedSlots = getBookedSlots(selectedDate, duration);
  
  const isSlotBooked = (time: string) => {
    return bookedSlots.includes(time);
  };

  const getSlotStatus = (time: string) => {
    if (isSlotBooked(time)) {
      return 'booked';
    }
    return 'available';
  };

  // Reset selected time when duration changes and current selection is no longer valid
  const handleDurationChange = (newDuration: number) => {
    onDurationChange(newDuration);
    const newSlots = generateTimeSlots(newDuration);
    if (selectedTime && !newSlots.includes(selectedTime)) {
      onTimeChange("");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Select Date & Time</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Calendar */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base">Choose Date</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
              className="rounded-md border pointer-events-auto w-full"
            />
          </CardContent>
        </Card>

        {/* Time & Duration */}
        <div className="space-y-4 md:space-y-6">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">Duration</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <Select value={duration.toString()} onValueChange={(value) => handleDurationChange(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value.toString()}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base flex flex-col sm:flex-row sm:items-center gap-2">
                Available Times
                {selectedDate && (
                  <span className="text-xs font-normal text-gray-500">
                    for {selectedDate.toLocaleDateString()}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              {!selectedDate ? (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm md:text-base">Please select a date first</p>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                      <span>Booked</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {timeSlots.map((time) => {
                      const status = getSlotStatus(time);
                      const isSelected = selectedTime === time;
                      const isBooked = status === 'booked';
                      
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => !isBooked && onTimeChange(time)}
                          disabled={isBooked}
                          className={`text-xs md:text-sm relative p-2 md:p-3 h-auto whitespace-normal ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                              : isBooked
                              ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                              : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-center gap-1">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-center sm:text-left">{time}</span>
                            {isBooked && (
                              <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                            )}
                            {!isBooked && !isSelected && (
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                  
                  {bookedSlots.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-xs md:text-sm text-red-700 font-medium mb-1">
                        Unavailable slots for {selectedDate.toLocaleDateString()}:
                      </p>
                      <p className="text-xs md:text-sm text-red-600">
                        {bookedSlots.join(", ")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
