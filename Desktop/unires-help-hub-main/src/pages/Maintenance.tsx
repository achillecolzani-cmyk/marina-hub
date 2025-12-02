import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Maintenance = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request submitted!",
      description: "Your maintenance request has been received. We'll get back to you soon.",
    });
    setTitle("");
    setDescription("");
    setPriority("");
    setCategory("");
  };

  const existingRequests = [
    {
      id: 1,
      title: "Broken heater in room",
      status: "in-progress",
      priority: "high",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Leaky faucet",
      status: "pending",
      priority: "medium",
      date: "5 days ago",
    },
    {
      id: 3,
      title: "Door lock replacement",
      status: "completed",
      priority: "high",
      date: "1 week ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-orange-50 text-orange-700 border-orange-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Maintenance Requests</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Report issues and track your maintenance requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit New Request */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Wrench className="w-4 h-4 md:w-5 md:h-5" />
                  Submit New Request
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Describe the issue you're experiencing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs md:text-sm font-medium">Issue Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the problem"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-10 md:h-11 text-sm md:text-base"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs md:text-sm font-medium">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="heating">Heating/Cooling</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-xs md:text-sm font-medium">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs md:text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="text-sm md:text-base"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 md:h-12 text-sm md:text-base">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Existing Requests */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Your Requests</CardTitle>
                <CardDescription className="text-xs md:text-sm">Track your maintenance requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {existingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 md:p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <h4 className="font-medium text-xs md:text-sm text-foreground leading-snug">{request.title}</h4>
                      <Badge className={`${getPriorityColor(request.priority)} text-[10px] md:text-xs`}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(request.status)} text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <span className="text-[10px] md:text-xs text-muted-foreground">{request.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Maintenance;
