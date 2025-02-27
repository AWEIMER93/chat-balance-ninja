
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Hi there, I'm CiZi</h1>
        <p className="text-lg text-white/80 mb-12">— Citizens Digital Assistant —</p>
        
        <motion.div 
          className="mb-12"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto glass-effect flex items-center justify-center">
            <img 
              src="https://logos-world.net/wp-content/uploads/2021/08/Citizens-Bank-Symbol.png" 
              alt="Citizens Bank Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </motion.div>

        <div className="glass-effect rounded-xl p-6 mb-8 max-w-sm mx-auto">
          <h3 className="text-white font-semibold mb-2">Get help 24/7</h3>
          <p className="text-white/80 text-sm">
            Get instant answers to your questions. Literally any time you have them.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/chat")}
            className="w-full bg-white text-primary hover:bg-white/90 text-lg font-semibold py-6"
          >
            Start Chat
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
