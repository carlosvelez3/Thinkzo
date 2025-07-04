import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import AdminDashboard from './components/admin/AdminDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const { user } = useAuth();

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
      case 'contact':
        return (
          <div className="bg-slate-900 min-h-screen">
            <div className="pt-32">
              <Contact />
            </div>
          </div>
        );
      case 'admin':
        return user ? <AdminDashboard /> : (
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
      
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
}

export default App;