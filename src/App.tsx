import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/" element={
            <div className="bg-slate-900 min-h-screen">
              <Navbar />
              <Hero />
              <Services />
              <Process />
              <Pricing />
              <Contact />
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;