import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, MessageSquare, Wrench, Waves, LogOut, Menu, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Waves, label: "Marina", path: "/facilities" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: Wrench, label: "Maintenance", path: "/maintenance" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  if (isMobile) {
    return (
      <>
        <nav className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-ocean flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-base text-foreground block leading-none">Marina Living</span>
                  <span className="text-[10px] text-muted-foreground">Campus Housing</span>
                </div>
              </div>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={location.pathname === item.path ? "default" : "ghost"}
                        onClick={() => handleNavigation(item.path)}
                        className="justify-start gap-3 h-12 text-base"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    ))}
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className="justify-start gap-3 h-12 text-base mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col gap-1 h-14 px-3 ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Button>
            ))}
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-ocean flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-lg text-foreground block leading-none">Marina Living</span>
              <span className="text-xs text-muted-foreground">Campus Housing</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            <Button variant="ghost" onClick={handleLogout} className="gap-2 ml-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
