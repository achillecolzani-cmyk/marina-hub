import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Home, MapPin, Calendar, Waves, Wrench, LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    room: "Marina A-204",
    checkIn: "2024-09-01",
    checkOut: "2025-06-30",
  });

  const upcomingBookings = [
    { id: 1, facility: "Kayak", date: "Tomorrow, 10:00 AM", icon: Waves },
    { id: 2, facility: "Dragon Boat", date: "Dec 2, 2:00 PM", icon: Waves },
  ];

  const maintenanceRequests = [
    { id: 1, issue: "Leaky faucet", status: "In Progress", date: "Nov 28", icon: Wrench },
    { id: 2, issue: "Window lock", status: "Completed", date: "Nov 25", icon: Wrench },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">My Profile</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Manage your account and view your activity</p>
        </div>

        {/* Profile Information */}
        <Card className="border-0 shadow-lg mb-6 md:mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your account details and contact information</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-xs md:text-sm"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-xs md:text-sm">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-xs md:text-sm">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-xs md:text-sm">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room" className="flex items-center gap-2 text-xs md:text-sm">
                  <Home className="w-4 h-4" />
                  Room Number
                </Label>
                <Input
                  id="room"
                  value={profile.room}
                  disabled
                  className="text-sm md:text-base bg-muted"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm md:text-base text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Accommodation Period
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Check-in</p>
                  <p className="font-medium text-sm md:text-base">{new Date(profile.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Check-out</p>
                  <p className="font-medium text-sm md:text-base">{new Date(profile.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="border-0 shadow-lg mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Upcoming Bookings</CardTitle>
            <CardDescription className="text-xs md:text-sm">Your scheduled facility reservations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <booking.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base text-foreground">{booking.facility}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                  Cancel
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card className="border-0 shadow-lg mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Maintenance Requests</CardTitle>
            <CardDescription className="text-xs md:text-sm">Your recent maintenance requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {maintenanceRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <request.icon className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base text-foreground">{request.issue}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{request.date}</p>
                  </div>
                </div>
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === "Completed" 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                    : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-sm md:text-base"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </main>
    </div>
  );
};

export default Profile;
