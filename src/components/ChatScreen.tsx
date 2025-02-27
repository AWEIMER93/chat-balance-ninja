
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ScenarioStep {
  id: string;
  message: string;
  options?: string[];
  nextStep?: string;
}

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickActions = [
    { id: 1, text: "Manage card", icon: "💳" },
    { id: 2, text: "Send money", icon: "💸" },
    { id: 3, text: "Find docs", icon: "📄" },
    { id: 4, text: "Get my balance", icon: "💰" },
    { id: 5, text: "Update profile", icon: "👤" },
    { id: 6, text: "Set up auto-transfer", icon: "⚡" },
  ];

  const scenarioFlows = {
    1: {
      initial: {
        message: "Hi CiZi, I need help with setting up auto-transfers.",
        response: "I can help you set up automatic transfers to maintain your minimum balance. Your current minimum balance requirement is $1,500. Would you like to set up auto-transfers from your savings account when your balance falls below this limit?",
        options: ["Yes, please help me set it up", "No, maybe later"]
      },
      confirm: {
        message: "Yes, please help me set it up",
        response: "I'll help you set up automatic transfers from your savings account. When your checking account balance falls below $1,500, I'll automatically transfer $500 from your savings account. Does this work for you?",
        options: ["Yes, that's perfect", "No, I want to change the amount"]
      },
      complete: {
        message: "Yes, that's perfect",
        response: "Great! I've set up the automatic transfers. Now whenever your checking account balance falls below $1,500, I'll automatically transfer $500 from your savings account. You won't have to worry about minimum balance fees anymore.",
      }
    },
    2: {
      initial: {
        message: "Set-up auto-transfers from my savings to checking when my account balance is below the minimum limits so next time I don't get charged a fee",
        response: "I understand you want to avoid fees. I can set up automatic transfers from your savings account when your checking balance falls below $1,500. The transfer amount will be $500. Would you like me to set this up now?",
        options: ["Yes, set it up now", "No, I'll do it later"]
      },
      complete: {
        message: "Yes, set it up now",
        response: "Perfect! I've set up the automatic transfers. Starting now, I'll monitor your checking account balance and transfer $500 from your savings whenever it falls below $1,500. You'll receive a notification each time a transfer occurs.",
      }
    },
    3: {
      initial: {
        message: "I see that your current balance is low and you're about to incur a fee. Would you like me to transfer funds from another account to avoid the fee?",
        options: ["Yes, please transfer the funds", "No, I'll handle it myself"]
      },
      complete: {
        message: "Yes, please transfer the funds",
        response: "I've transferred $500 from your savings account to your checking account. Your new checking account balance is $1,750, which is above the minimum requirement. You won't be charged any fees.",
      }
    },
    4: {
      initial: {
        message: "You have a payment scheduled for HelloFresh via PayPal that will push your account balance below the required minimum. I've made sure those funds are covered by transferring $50 from your savings account to your checking account.",
        response: "The transfer has been completed successfully. Your new checking account balance will be $1,550 after the HelloFresh payment, keeping you above the minimum balance requirement."
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // For demo purposes, handle each scenario
    if (currentScenario === 0) {
      // Start scenario 1
      addMessage(input, "user");
      setInput("");
      setTimeout(() => {
        addMessage(scenarioFlows[1].initial.response, "bot");
        setCurrentScenario(1);
        setCurrentStep("initial");
      }, 1000);
    } else if (currentScenario === 1 && currentStep === "initial") {
      addMessage(input, "user");
      setInput("");
      setTimeout(() => {
        addMessage(scenarioFlows[1].confirm.response, "bot");
        setCurrentStep("confirm");
      }, 1000);
    } else if (currentScenario === 1 && currentStep === "confirm") {
      addMessage(input, "user");
      setInput("");
      setTimeout(() => {
        addMessage(scenarioFlows[1].complete.response, "bot");
        setCurrentStep(null);
        setCurrentScenario(2);
        toast({
          title: "Auto-transfer Setup Complete",
          description: "Your automatic transfers have been configured successfully.",
        });
      }, 1000);
    } else if (currentScenario === 2) {
      // Handle scenario 2
      addMessage(input, "user");
      setInput("");
      if (input.toLowerCase().includes("auto-transfer") || input.toLowerCase().includes("fee")) {
        setTimeout(() => {
          addMessage(scenarioFlows[2].initial.response, "bot");
          setTimeout(() => {
            addMessage(scenarioFlows[2].complete.response, "bot");
            setCurrentScenario(3);
            toast({
              title: "Auto-transfer Setup Complete",
              description: "Your automatic transfers have been configured successfully.",
            });
          }, 2000);
        }, 1000);
      }
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording && currentScenario >= 3) {
      // Simulate voice response for scenarios 3 and 4
      setTimeout(() => {
        if (currentScenario === 3) {
          addMessage(scenarioFlows[3].initial.message, "bot");
          setTimeout(() => {
            addMessage("Yes, please transfer the funds", "user");
            setTimeout(() => {
              addMessage(scenarioFlows[3].complete.response, "bot");
              setCurrentScenario(4);
              toast({
                title: "Transfer Complete",
                description: "Funds have been transferred to avoid fees.",
              });
            }, 1500);
          }, 1500);
        } else if (currentScenario === 4) {
          addMessage(scenarioFlows[4].initial.message, "bot");
          setTimeout(() => {
            addMessage(scenarioFlows[4].initial.response, "bot");
            toast({
              title: "Proactive Transfer Complete",
              description: "Funds transferred to cover upcoming payment.",
            });
          }, 1500);
        }
      }, 1500);
      setIsRecording(false);
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Good morning, Paula!</h1>
          <motion.div 
            className="w-24 h-24 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-emerald-400/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <img 
                      src="https://companieslogo.com/img/orig/RBS.D-0e74e871.png?t=1720244493" 
                      alt="Citizens Bank Logo"
                      className="w-8 h-8 object-contain"
                    />
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
                className={`max-w-[80%] rounded-3xl p-4 ${
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
        <div className="grid grid-cols-3 gap-3 mb-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="pill-button w-full flex items-center justify-center gap-2 text-white/90 hover:text-white text-sm"
              >
                <span>{action.icon}</span>
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
            className="bg-black/20 border-0 text-white placeholder:text-white/50 rounded-full px-6 py-4 h-auto"
          />
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className={`rounded-full w-12 h-12 ${isRecording ? "bg-red-500" : "bg-emerald-500"}`}
              onClick={handleMicClick}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="rounded-full w-12 h-12 bg-emerald-500"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
