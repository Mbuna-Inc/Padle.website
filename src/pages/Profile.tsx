import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Download,
  Lock,
  Trash2,
  LogOut,
  Camera,
  Settings,
  FileText,
  Search,
  Filter
} from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { getUpcomingBookings, getPastBookings, cancelBooking } = useBookings();
  const { addNotification } = useNotifications();
  
  // State for different sections
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Booking view states
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();
  const allBookings = [...upcomingBookings, ...pastBookings];

  // Filter and search bookings
  const filteredBookings = allBookings.filter(booking => {
    // Filter by type
    const matchesFilter = filterType === 'all' || 
      (filterType === 'upcoming' && upcomingBookings.includes(booking)) ||
      (filterType === 'past' && pastBookings.includes(booking));
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      booking.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.courtType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format(booking.date, 'MMM dd, yyyy').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditingProfile(false);
    addNotification({
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      type: "success"
    });
  };

  const handleCancelProfile = () => {
    setEditForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || ""
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification({
        title: "Password Mismatch",
        message: "New password and confirm password do not match.",
        type: "error"
      });
      return;
    }
    
    // In a real app, this would call an API to change password
    addNotification({
      title: "Password Changed",
      message: "Your password has been changed successfully.",
      type: "success"
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete account
    logout();
    addNotification({
      title: "Account Deleted",
      message: "Your account has been permanently deleted.",
      type: "info"
    });
  };

  const handleLogout = () => {
    logout();
    addNotification({
      title: "Logged Out",
      message: "You have been successfully logged out.",
      type: "info"
    });
  };

  const downloadReceipt = (booking: any) => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      bookingId: booking.id,
      courtName: booking.courtName,
      date: format(booking.date, 'MMM dd, yyyy'),
      time: booking.time,
      amount: booking.totalAmount,
      paymentMethod: booking.paymentMethod
    };
    
    // Create a simple text receipt for demo
    const receiptText = `
      PLAYEASY - BOOKING RECEIPT
      ==========================
      
      Booking ID: ${receiptData.bookingId}
      Court: ${receiptData.courtName}
      Date: ${receiptData.date}
      Time: ${receiptData.time}
      Amount: MK${receiptData.amount}
      Payment Method: ${receiptData.paymentMethod}
      
      Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      
      Thank you for choosing PlayEasy!
      For support, contact: support@playeasy.com
    `;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification({
      title: "Receipt Downloaded",
      message: "Your receipt has been downloaded successfully.",
      type: "success"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isUpcomingBooking = (booking: any) => {
    return upcomingBookings.includes(booking);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <Navigation onLogin={() => {}} />
        <div className="pt-20 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Please log in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Navigation onLogin={() => {}} />
      
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your bookings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center pb-4">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{user.fullName}</CardTitle>
                <p className="text-gray-600 text-sm">Member since {user.memberSince}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Profile Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>{user.totalBookings} bookings</span>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  
                  <Button 
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Edit Profile Modal */}
            {isEditingProfile && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelProfile} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Change Password Modal */}
            {isChangingPassword && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleChangePassword} className="flex-1">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                      }} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delete Account Confirmation */}
            {showDeleteConfirm && (
              <Card className="mb-6 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleDeleteAccount}
                      variant="destructive" 
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bookings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filter Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      All ({allBookings.length})
                    </Button>
                    <Button
                      variant={filterType === 'upcoming' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('upcoming')}
                    >
                      Upcoming ({upcomingBookings.length})
                    </Button>
                    <Button
                      variant={filterType === 'past' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('past')}
                    >
                      Past ({pastBookings.length})
                    </Button>
                  </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || filterType !== 'all' 
                        ? "Try adjusting your search or filters."
                        : "You don't have any bookings yet."
                      }
                    </p>
                    {!searchQuery && filterType === 'all' && (
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
                        Book a Court
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{booking.courtName}</h3>
                                  <p className="text-gray-600 text-sm">{booking.courtType}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1 capitalize">{booking.status}</span>
                                  </Badge>
                                  {isUpcomingBooking(booking) && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                      Upcoming
                                    </Badge>
                                  )}
                                </div>
                              </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{format(booking.date, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{booking.duration}h</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">MK{booking.totalAmount}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />
                          
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              Payment: {booking.paymentMethod}
                            </div>
                            <div className="flex gap-2">
                              {isUpcomingBooking(booking) && booking.status === 'confirmed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    cancelBooking(booking.id);
                                    addNotification({
                                      title: "Booking Cancelled",
                                      message: `Your booking for ${booking.courtName} has been cancelled.`,
                                      type: "info"
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                              )}
                                                                {!isUpcomingBooking(booking) && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => downloadReceipt(booking)}
                                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </Button>
                                  )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile; 