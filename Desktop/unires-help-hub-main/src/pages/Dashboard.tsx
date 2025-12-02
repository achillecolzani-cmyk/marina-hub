import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Wrench, Bell, Users, Calendar, CheckCircle, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Room Number", value: "Marina A-204", icon: Home, color: "from-blue-500 to-blue-600" },
    { label: "Open Requests", value: "2", icon: Wrench, color: "from-orange-500 to-orange-600" },
    { label: "Messages", value: "3", icon: MessageSquare, color: "from-cyan-500 to-cyan-600" },
    { label: "Notifications", value: "5", icon: Bell, color: "from-purple-500 to-purple-600" },
  ];

  const quickActions = [
    {
      title: "Book Facilities",
      description: "Reserve kayaks, bikes, and marina excursions",
      icon: Waves,
      action: () => navigate("/facilities"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Assistant",
      description: "Get instant help with any questions",
      icon: MessageSquare,
      action: () => navigate("/chat"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Report Issue",
      description: "Submit maintenance requests",
      icon: Wrench,
      action: () => navigate("/maintenance"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Community",
      description: "Connect with residents",
      icon: Users,
      action: () => {},
      gradient: "from-green-500 to-emerald-500",
    },
  ];


  const recentActivities = [
    { title: "Kayak booking confirmed for tomorrow", time: "2 hours ago", icon: Waves, color: "text-blue-600" },
    { title: "Maintenance request approved", time: "5 hours ago", icon: CheckCircle, color: "text-green-600" },
    { title: "New message from staff", time: "1 day ago", icon: MessageSquare, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Welcome back, Alex!</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Here's what's happening at Marina Living</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-10">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="flex items-center justify-between p-4 md:p-6">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1.5 font-medium">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-2xl font-semibold text-foreground mb-4 md:mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={action.action}
              >
                <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-lg text-foreground mb-0.5 md:mb-1.5">{action.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-xs md:text-sm">Your latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base text-foreground leading-snug">{activity.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
