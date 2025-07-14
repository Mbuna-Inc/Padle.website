import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Booking {
  id: string;
  courtId: number;
  courtName: string;
  courtType: string;
  date: Date;
  time: string;
  duration: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  equipment?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  createdAt: Date;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByStatus: (status: Booking['status']) => Booking[];
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  // Load bookings from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedBookings = localStorage.getItem(`bookings_${user.id}`);
      if (savedBookings) {
        try {
          const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
            ...booking,
            date: new Date(booking.date),
            createdAt: new Date(booking.createdAt)
          }));
          setBookings(parsedBookings);
        } catch (error) {
          console.error('Error parsing saved bookings:', error);
        }
      } else {
        // Create some mock bookings for demonstration
        const mockBookings: Booking[] = [
          {
            id: 'booking_1703123456789_abc123def',
            courtId: 1,
            courtName: 'Premium Tennis Court A',
            courtType: 'Tennis',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            time: '2:00 PM - 3:00 PM',
            duration: 1,
            totalAmount: 50,
            status: 'confirmed',
            equipment: [
              { name: 'Tennis Racket', quantity: 2, price: 10 }
            ],
            paymentMethod: 'Credit Card',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          },
          {
            id: 'booking_1703123456790_def456ghi',
            courtId: 2,
            courtName: 'Badminton Court B',
            courtType: 'Badminton',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
            time: '3:00 PM - 4:00 PM',
            duration: 1,
            totalAmount: 35,
            status: 'pending',
            paymentMethod: 'Mobile Money',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: 'booking_1703123456791_ghi789jkl',
            courtId: 3,
            courtName: 'Multi-Purpose Court C',
            courtType: 'Basketball',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            time: '1:00 PM - 2:00 PM',
            duration: 1,
            totalAmount: 40,
            status: 'completed',
            equipment: [
              { name: 'Basketball', quantity: 1, price: 5 }
            ],
            paymentMethod: 'Cash',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
          }
        ];
        setBookings(mockBookings);
        localStorage.setItem(`bookings_${user.id}`, JSON.stringify(mockBookings));
      }
    }
  }, [user]);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    if (user && bookings.length > 0) {
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(bookings));
    }
  }, [bookings, user]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
  };

  const getBookingsByStatus = (status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.date > now && booking.status !== 'cancelled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.date < now || booking.status === 'cancelled'
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const value: BookingContextType = {
    bookings,
    addBooking,
    cancelBooking,
    getBookingsByStatus,
    getUpcomingBookings,
    getPastBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}; 