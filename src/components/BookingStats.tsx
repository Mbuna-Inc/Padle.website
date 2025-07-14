import { useBookings } from "@/contexts/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export const BookingStats = () => {
  const { bookings, getBookingsByStatus, getUpcomingBookings } = useBookings();
  
  const confirmedBookings = getBookingsByStatus('confirmed');
  const pendingBookings = getBookingsByStatus('pending');
  const completedBookings = getBookingsByStatus('completed');
  const cancelledBookings = getBookingsByStatus('cancelled');
  const upcomingBookings = getUpcomingBookings();

  const totalSpent = bookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Upcoming",
      value: upcomingBookings.length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Completed",
      value: completedBookings.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Spent",
      value: `MK${totalSpent}`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Booking Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confirmed</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {confirmedBookings.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {pendingBookings.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {completedBookings.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cancelled</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {cancelledBookings.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500">No booking activity yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.courtName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 