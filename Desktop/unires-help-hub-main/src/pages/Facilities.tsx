import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Bike, Waves, Ship, Activity, MapPin, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import kayakHero from "@/assets/kayak-hero.jpg";
import dragonBoatHero from "@/assets/dragon-boat-hero.jpg";
import supHero from "@/assets/sup-hero.jpg";
import whaleHero from "@/assets/whale-hero.jpg";
import bikeHero from "@/assets/bike-hero.jpg";
import excursionHero from "@/assets/excursion-hero.jpg";

interface Facility {
  id: string;
  name: string;
  description: string;
  icon: any;
  image: string;
  duration: string;
  capacity: string;
  price: string;
  category: string;
}

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();

  const facilities: Facility[] = [
    {
      id: "whale",
      name: "Whale Watching",
      description: "Experience the majesty of ocean giants in their natural habitat",
      icon: Waves,
      image: whaleHero,
      duration: "3 hours",
      capacity: "20 people",
      price: "Free for residents",
      category: "Excursion",
    },
    {
      id: "dragon-boat",
      name: "Dragon Boat",
      description: "Team paddling experience on traditional dragon boats",
      icon: Ship,
      image: dragonBoatHero,
      duration: "2 hours",
      capacity: "16 people",
      price: "Free for residents",
      category: "Water Sport",
    },
    {
      id: "kayak",
      name: "Kayaking",
      description: "Explore the marina at your own pace",
      icon: Activity,
      image: kayakHero,
      duration: "1-3 hours",
      capacity: "2 people per kayak",
      price: "Free for residents",
      category: "Water Sport",
    },
    {
      id: "sup",
      name: "Stand-Up Paddleboard",
      description: "Balance and serenity on the calm marina waters",
      icon: Activity,
      image: supHero,
      duration: "1-2 hours",
      capacity: "1 person",
      price: "Free for residents",
      category: "Water Sport",
    },
    {
      id: "bike",
      name: "Bicycle Rental",
      description: "Explore coastal trails and nearby attractions",
      icon: Bike,
      image: bikeHero,
      duration: "Half/Full day",
      capacity: "1 person",
      price: "Free for residents",
      category: "Land Activity",
    },
    {
      id: "coastal",
      name: "Coastal Excursion",
      description: "Guided tour of the beautiful marina coastline",
      icon: MapPin,
      image: excursionHero,
      duration: "4 hours",
      capacity: "12 people",
      price: "Free for residents",
      category: "Excursion",
    },
  ];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking confirmed!",
      description: `${selectedFacility?.name} reserved for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    });
    setSelectedFacility(null);
    setSelectedTime("");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent text-accent-foreground text-xs md:text-sm font-medium mb-2 md:mb-4">
            <Waves className="w-3 h-3 md:w-4 md:h-4" />
            Marina Living
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Book Your Experience
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore the ocean and coastline with our complimentary facilities and excursions
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {facilities.map((facility) => (
            <Card
              key={facility.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer bg-card"
              onClick={() => setSelectedFacility(facility)}
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] md:text-xs font-medium text-foreground">
                  {facility.category}
                </div>
              </div>
              <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-ocean flex items-center justify-center flex-shrink-0">
                    <facility.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base md:text-lg text-foreground mb-0.5 md:mb-1">
                      {facility.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-3 text-[10px] md:text-xs text-muted-foreground border-t border-border">
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {facility.duration}
                  </div>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <Activity className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {facility.capacity}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={!!selectedFacility} onOpenChange={() => setSelectedFacility(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{selectedFacility?.name}</DialogTitle>
            <DialogDescription className="text-xs md:text-base">
              {selectedFacility?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedFacility && (
            <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedFacility.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{selectedFacility.capacity}</span>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-medium">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border shadow-sm mx-auto"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-medium">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="h-auto py-2.5 md:py-3 text-xs md:text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleBooking} className="w-full h-11 md:h-12 text-sm md:text-base">
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Facilities;
