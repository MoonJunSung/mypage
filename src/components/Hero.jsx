import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <h1>안녕하세요,<br /><strong>문준성</strong>입니다</h1>
      <p>분당경영고등학교 학생 · 사용자 경험과 성능을 사랑합니다.</p>
      <div className="cta">
        <a className="btn primary" href="#contact">연락하기</a>
        <a className="btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">이력서 보기</a>
      </div>
    </section>
  );
}
