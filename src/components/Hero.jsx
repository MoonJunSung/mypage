import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiMail } from 'react-icons/fi';
import { FaInstagram, FaDiscord } from 'react-icons/fa';

export default function Hero() {
  return (
    <>
      {/* Social sidebar */}
      <div className="hero-social">
        <a href="https://github.com/MoonJunSung" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FiGithub />
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <FaDiscord />
        </a>
        <a href="mailto:s26-30405@bundang-mgt.hs.kr" aria-label="Email">
          <FiMail />
        </a>
      </div>

      <section className="hero" id="home">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="hero-badge">
            <span className="dot" />
            제 포트폴리오에 오신 것을 환영합니다!
          </div>

          <h1>
            안녕하세요!
            <br />
            <span className="gradient-text">문준성</span>입니다
          </h1>

          <p className="hero-subtitle">
            분당경영고등학교 학생 · 사용자 경험과 성능을 사랑하는 개발자입니다.
            <br />
            지금까지의 제 여정을 한 번 만나보러 가볼까요?
          </p>

          <div className="hero-cta">
            <a className="btn primary" href="#projects">프로젝트 보기</a>
            <a className="btn" href="#contact">연락하기</a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
