import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, Download, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface ChatInterfaceProps {
  fullScreen?: boolean;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ fullScreen = false, className = '' }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello${user ? ` ${user.user_metadata?.full_name || 'there'}` : ''}! I'm your AI assistant powered by ChatGPT. I can help you with questions about our services, provide technical support, or assist with general inquiries. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to ChatGPT
      // In production, this would call your backend API
      const response = await simulateChatGPTResponse(userMessage.content, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing some technical difficulties right now. Please try again in a moment, or contact our support team if the issue persists.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate ChatGPT response (replace with actual API call)
  const simulateChatGPTResponse = async (userInput: string, chatHistory: Message[]): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerInput = userInput.toLowerCase();

    // Context-aware responses based on your business
    if (lowerInput.includes('service') || lowerInput.includes('what do you do')) {
      return "I'd be happy to tell you about Thinkzo's services! We specialize in AI-powered digital solutions including:\n\n🧠 **Neural Website Design** - Websites that learn and adapt to user behavior\n🎨 **Intelligent Branding** - AI-driven brand identities that resonate with your audience\n📱 **Smart Mobile Apps** - Apps with predictive features and intelligent interfaces\n📈 **Neural Marketing** - AI-optimized campaigns that improve automatically\n🛡️ **Cognitive Security** - Advanced AI security that adapts to threats\n⚡ **Performance AI** - Systems that continuously optimize themselves\n\nWhich of these interests you most? I can provide more detailed information about any service.";
    }

    if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return "Great question about pricing! Our AI-powered solutions are competitively priced with transparent, moderate rates. Here are our main packages:\n\n💡 **Startup Bundle** - $500\n• Perfect for new businesses\n• 5-page responsive website with basic AI features\n\n🧠 **Smart Business AI Bundle** - $950 (Most Popular)\n• Everything in Startup plus AI chatbot integration\n• Performance monitoring and booking systems\n\n🚀 **Enterprise Neural Suite** - $1,850\n• Complete AI-powered business solution\n• Advanced integrations and 3 months maintenance\n\nWe also offer individual services starting from $30-$400 depending on complexity. Would you like me to help you find the perfect solution for your needs?";
    }

    if (lowerInput.includes('ai') || lowerInput.includes('artificial intelligence') || lowerInput.includes('neural')) {
      return "Excellent question about our AI capabilities! At Thinkzo, we integrate cutting-edge artificial intelligence into every solution:\n\n🤖 **Machine Learning** - Our systems learn from user behavior to optimize performance\n🧠 **Neural Networks** - Advanced pattern recognition for predictive features\n📊 **Predictive Analytics** - Forecast user needs and market trends\n🎯 **Smart Automation** - Automate repetitive tasks intelligently\n🔄 **Adaptive Systems** - Solutions that evolve and improve over time\n\nOur AI isn't just a buzzword - it's practical intelligence that delivers real business value. What specific AI capabilities are you most interested in for your project?";
    }

    if (lowerInput.includes('contact') || lowerInput.includes('get started') || lowerInput.includes('begin')) {
      return "I'm excited to help you get started with Thinkzo! Here are the best ways to begin:\n\n📞 **Schedule a Consultation**\n• Free 30-45 minute session to discuss your goals\n• We'll analyze your needs and recommend solutions\n\n💬 **Start a Project**\n• Use our project submission form for detailed planning\n• Get a custom quote within 24 hours\n\n📧 **Direct Contact**\n• Email: team@thinkzo.ai\n• Phone: +1 (555) 123-4567\n\nWould you like me to help you start a project submission, or do you have specific questions about our process first?";
    }

    if (lowerInput.includes('team') || lowerInput.includes('who') || lowerInput.includes('about')) {
      return "I'd love to tell you about the brilliant minds behind Thinkzo! Our team consists of:\n\n👩‍💼 **Sarah Chen** - CEO & Founder\n• Former Google AI researcher with 10+ years in neural networks\n• Passionate about democratizing AI for businesses\n\n👨‍💻 **Marcus Rodriguez** - CTO\n• Full-stack architect specializing in scalable AI systems\n• Previously led engineering teams at Tesla and SpaceX\n\n👩‍🎨 **Emily Watson** - Head of Design\n• Award-winning UX designer with expertise in neural interface design\n• Creates intuitive experiences that bridge human and AI interaction\n\n👨‍🔬 **David Kim** - AI Research Lead\n• PhD in Computer Science from MIT\n• Specializes in natural language processing and computer vision\n\nWe're a passionate team dedicated to making AI accessible and transformative for every business. What would you like to know about our approach or experience?";
    }

    // Default responses for general conversation
    const responses = [
      "That's an interesting question! Based on what you've shared, I'd recommend exploring our AI-powered solutions that can adapt to your specific needs. Could you tell me more about what you're looking to achieve?",
      
      "I understand what you're asking about. At Thinkzo, we believe in creating intelligent solutions that grow with your business. What's the main challenge you're facing that brought you here today?",
      
      "Great point! Our neural-powered approach means we can create solutions that learn and improve over time. This is particularly valuable for businesses looking to stay ahead of the curve. What industry are you in?",
      
      "That's exactly the kind of forward-thinking approach we love to see! Our AI systems are designed to anticipate needs and optimize performance automatically. Would you like to explore how this could work for your specific situation?",
      
      "I appreciate you sharing that with me. Our team has experience working with businesses of all sizes to implement AI solutions that deliver real results. What's your timeline for implementing new technology solutions?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: `Hello${user ? ` ${user.user_metadata?.full_name || 'there'}` : ''}! I'm your AI assistant powered by ChatGPT. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkzo-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${fullScreen ? 'h-screen' : 'h-[600px]'} flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Powered by ChatGPT</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportChat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300"
            title="Export Chat"
          >
            <Download size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] group ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="text-white" size={16} />
                  ) : (
                    <Bot className="text-white" size={16} />
                  )}
                </div>
                
                <div className={`relative rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyMessage(message.content)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-all duration-300"
                      title="Copy message"
                    >
                      <Copy size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="text-purple-400 animate-spin" size={16} />
                  <span className="text-slate-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Thinkzo's services, AI solutions, or how we can help your business..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/20 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </div>
        
        <div className="mt-3 text-xs text-slate-500 text-center">
          AI responses are generated and may not always be accurate. For important matters, please contact our team directly.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;