import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const WEBHOOK_URL = "https://aiagent2000.app.n8n.cloud/webhook/2d4a3f36-2ff1-4874-b5bf-bc7da5a44a79";

const Chat = () => {
  const [chatId] = useState(() => {
    if (typeof window === "undefined") return `chat_${Date.now()}`;
    const existing = localStorage.getItem("chatId");
    if (existing) return existing;
    const generated = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("chatId", generated);
    return generated;
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your Marina Living assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${WEBHOOK_URL}?chatId=${encodeURIComponent(chatId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message: userMessage.content,
          messages: nextMessages.map((m) => ({
            id: m.id,
            content: m.content,
            role: m.role,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      });

      let assistantContent = "I'm a mock assistant right now. Enable Lovable Cloud to connect real AI functionality!";

      if (response.ok) {
        try {
          const data = await response.json();
          assistantContent = data?.reply || data?.message || JSON.stringify(data);
        } catch {
          const text = await response.text();
          assistantContent = text || assistantContent;
        }
      } else {
        assistantContent = "Sorry, I couldn't reach the assistant right now.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to reach webhook", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Something went wrong while contacting the assistant. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-4 md:py-10 max-w-4xl">
        <div className="mb-4 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">AI Assistant</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Get instant help with your accommodation needs</p>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-220px)] md:h-[650px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-gradient-ocean flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] md:max-w-[75%] rounded-2xl px-4 md:px-5 py-2.5 md:py-3.5 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-ocean text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 md:gap-3 justify-start">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-gradient-ocean flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 md:px-5 py-2.5 md:py-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 md:p-5 bg-muted/30">
              <div className="flex gap-2 md:gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 h-11 md:h-12 text-sm md:text-base"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-11 md:h-12 px-4 md:px-6">
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
