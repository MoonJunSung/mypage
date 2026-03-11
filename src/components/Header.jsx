import React, { useState, useEffect } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <a className="logo" href="#home">문준성</a>

      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="메뉴 토글"
      >
        {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>

      <nav className={`site-nav${mobileOpen ? ' open' : ''}`} aria-label="주요">
        <a href="#about" onClick={handleNavClick}>소개</a>
        <a href="#timeline" onClick={handleNavClick}>타임라인</a>
        <a href="#skills" onClick={handleNavClick}>기술</a>
        <a href="#projects" onClick={handleNavClick}>프로젝트</a>
        <a href="#contact" onClick={handleNavClick}>연락</a>
      </nav>
    </header>
  );
}

