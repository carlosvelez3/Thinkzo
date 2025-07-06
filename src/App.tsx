import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useContent } from './hooks/useContent';
import Header from './components/layout/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import ChatPage from './components/pages/ChatPage';
import EnhancedAdminDashboard from './components/admin/EnhancedAdminDashboard';
import ChatWidget from './components/chat/ChatWidget';
import SuccessPage from './components/pages/SuccessPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const { user } = useAuth();
  const { loading: contentLoading } = useContent();

  // Show loading screen while content is loading
  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="bg-slate-900 min-h-screen">
            <Hero />
            <Services />
            <Process />
            <Pricing />
            <Contact />
          </div>
        );
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'chat':
        return <ChatPage />;
      case 'success':
        return <SuccessPage />;
      case 'pricing':
        return (
          <div className="bg-slate-900 min-h-screen">
            <div className="pt-32">
              <Pricing />
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="bg-slate-900 min-h-screen">
            <div className="pt-32">
              <Contact />
            </div>
          </div>
        );
      case 'admin':
        return user ? <EnhancedAdminDashboard /> : (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
              <p className="text-slate-400">Please sign in to access the admin dashboard.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-slate-900 min-h-screen">
            <Hero />
            <Services />
            <Process />
            <Pricing />
            <Contact />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      
      {currentPage !== 'admin' && (
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      {renderPage()}
      
      {currentPage !== 'admin' && currentPage !== 'chat' && <Footer />}
      
      {/* Chat Widget - appears on all pages except chat and admin */}
      {currentPage !== 'chat' && currentPage !== 'admin' && (
        <ChatWidget 
          position="bottom-right"
          theme="dark"
          initialMessage="Hi! I'm your AI assistant. I can help you learn about Thinkzo's services, answer technical questions, or discuss how AI can transform your business. What would you like to know?"
        />
      )}
    </div>
  );
}

export default App;