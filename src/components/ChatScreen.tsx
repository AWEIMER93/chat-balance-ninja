
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { Mic, Send, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const quickActions = [
    { id: 1, text: "Manage card", icon: "💳" },
    { id: 2, text: "Send money", icon: "💸" },
    { id: 3, text: "Find docs", icon: "📄" },
    { id: 4, text: "Get my balance", icon: "💰" },
    { id: 5, text: "Update profile", icon: "👤" },
    { id: 6, text: "Make a Zelle transfer", icon: "⚡" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate CiZi's response
    setTimeout(() => {
      let response = "";
      if (input.toLowerCase().includes("fee")) {
        response = "A fee is charged when you do not maintain the minimum account balance. Would you like me to help you set up auto-transfers to avoid future fees?";
      } else if (input.toLowerCase().includes("auto-transfer")) {
        response = "I'll help you set up auto-transfers from your savings to checking account when the balance falls below the minimum limit. This will help you avoid fees in the future.";
      }

      if (response) {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: response,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen chat-gradient flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex items-center justify-between"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-sm">
            Insight
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 text-sm h-auto py-2"
            >
              <span className="mr-2">{action.icon}</span>
              {action.text}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search or ask for anything..."
            className="bg-white/10 border-0 text-white placeholder:text-white/50"
          />
          <Button
            size="icon"
            className={`${isRecording ? "bg-red-500" : "bg-emerald-500"}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-emerald-500"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
