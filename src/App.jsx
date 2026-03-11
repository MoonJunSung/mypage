import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Ambient background orbs */}
      <div className="ambient-bg">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
