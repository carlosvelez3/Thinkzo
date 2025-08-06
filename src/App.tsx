import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SuccessPage from './components/SuccessPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-950">
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/" element={
            <>
              <Navigation />
              <main>
                <Hero />
                <Features />
                <Pricing />
                <Contact />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;