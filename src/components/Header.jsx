import React from 'react';

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="site-header">
      <a className="logo" href="#home">문준성</a>
      <nav className="site-nav" aria-label="주요">
        <a href="#about">소개</a>
        <a href="#projects">프로젝트</a>
        <a href="#contact">연락</a>
        <button
          id="themeToggle"
          className="theme-toggle"
          aria-label="테마 전환"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌗'}
        </button>
      </nav>
    </header>
  );
}

