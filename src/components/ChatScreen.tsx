
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
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

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen chat-gradient flex flex-col">
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-sm"
          >
            Insight
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Good morning, Jane!</h1>
          <motion.div 
            className="w-24 h-24 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-emerald-400/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔄
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <p className="text-white/90 text-lg">How can I help you?</p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <motion.div
                layout
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent"
      >
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="pill-button w-full text-white/80 hover:text-white text-sm h-auto py-2 px-4"
              >
                <span className="mr-2">{action.icon}</span>
                {action.text}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search or ask for anything..."
            className="bg-black/20 border-0 text-white placeholder:text-white/50 rounded-full"
          />
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className={`rounded-full ${isRecording ? "bg-red-500" : "bg-emerald-500"}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="rounded-full bg-emerald-500"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
