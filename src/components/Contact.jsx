import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiMapPin, FiGithub } from 'react-icons/fi';
import { FaInstagram, FaDiscord } from 'react-icons/fa';

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="contact" className="section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">Get In Touch</div>
        <h2 className="section-title">연락하기</h2>
        <p className="section-desc">
          새로운 프로젝트나 협업 기회에 대해 이야기해보세요. 언제든지 연락주시면 빠르게 답변드리겠습니다.
        </p>

        <div className="contact-wrapper">
          {/* Left: Info */}
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              새로운 아이디어나 프로젝트에 대해 이야기하고 싶으시다면 
              언제든지 연락주세요. 함께 멋진 것을 만들어보아요!
            </p>

            <div className="contact-details">
              <div className="contact-detail">
                <div className="detail-icon"><FiMail /></div>
                <div className="detail-text">
                  <h4>Email</h4>
                  <p>s26-30405@bundang-mgt.hs.kr</p>
                </div>
              </div>
              <div className="contact-detail">
                <div className="detail-icon"><FiMapPin /></div>
                <div className="detail-text">
                  <h4>Location</h4>
                  <p>경기도 성남시, 대한민국</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
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
          </div>

          {/* Right: Form */}
          <form
            className="contact-form"
            action="https://formspree.io/f/xldwdken"
            method="POST"
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input id="name" name="name" type="text" placeholder="홍길동" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">제목</label>
              <input id="subject" name="subject" type="text" placeholder="문의 제목" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">메시지</label>
              <textarea id="message" name="message" rows="5" placeholder="내용을 입력해주세요..." required />
            </div>
            <button className="btn primary" type="submit">메시지 보내기</button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

