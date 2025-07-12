
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

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const durations = [
  { value: 1, label: "1 Hour" },
  { value: 2, label: "2 Hours" },
  { value: 3, label: "3 Hours" },
  { value: 4, label: "4 Hours" }
];

// Mock booking data - in real app this would come from API
const getBookedSlots = (date: Date | undefined) => {
  if (!date) return [];
  
  // Mock some booked slots for demonstration
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
  
  if (isToday) {
    return ["10:00 AM", "02:00 PM", "07:00 PM"];
  } else if (isTomorrow) {
    return ["11:00 AM", "03:00 PM"];
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
  const bookedSlots = getBookedSlots(selectedDate);
  
  const isSlotBooked = (time: string) => {
    return bookedSlots.includes(time);
  };

  const getSlotStatus = (time: string) => {
    if (isSlotBooked(time)) {
      return 'booked';
    }
    return 'available';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Date & Time</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Choose Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>

        {/* Time & Duration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={duration.toString()} onValueChange={(value) => onDurationChange(Number(value))}>
                <SelectTrigger>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Available Times
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-500">
                    for {selectedDate.toDateString()}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Please select a date first</p>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Booked</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
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
                          className={`text-sm relative ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                              : isBooked
                              ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                              : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300'
                          }`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                          {isBooked && (
                            <XCircle className="w-3 h-3 ml-1 text-red-500" />
                          )}
                          {!isBooked && !isSelected && (
                            <CheckCircle className="w-3 h-3 ml-1 text-green-500" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  
                  {bookedSlots.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-sm text-red-700 font-medium mb-1">
                        Unavailable slots for {selectedDate.toDateString()}:
                      </p>
                      <p className="text-sm text-red-600">
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
