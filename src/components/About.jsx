import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiUser, FiMapPin, FiBookOpen } from 'react-icons/fi';

const techIcons = [
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'HTML5', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
  { name: 'CSS3', icon: 'https://cdn.simpleicons.org/css/1572B6' },
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Java', icon: 'https://cdn.simpleicons.org/openjdk/FFFFFF' },
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/FFFFFF' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/vscodium/007ACC' },
  { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/646CFF' },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="about" className="section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">ABOUT</div>
        <h2 className="section-title">안녕하세요! 👋</h2>
        <p className="section-desc">
          끊임없이 더 나은 서비스를 제공하기 위해 노력하는 문준성입니다.
        </p>

        <div className="about-grid">
          <div className="about-text">
            <p>
              저는 개발에 대한 열정을 가지고 웹 프론트엔드 / 백엔드 기술을 학습하고 있습니다.
              사용자 경험을 최우선으로 생각하며, 깔끔하고 효율적인 코드를 작성하는 것을 좋아합니다.
            </p>
            <p>
              카카오톡 봇 개발부터 웹 게임, 크롬 확장 프로그램까지 다양한 프로젝트를 통해
              실전 경험을 쌓아가고 있습니다.
            </p>
          </div>

          <div className="about-info">
            <div className="about-card">
              <div className="card-icon">
                <FiUser />
              </div>
              <h4>이름</h4>
              <p>문준성</p>
            </div>
            <div className="about-card">
              <div className="card-icon">
                <FiBookOpen />
              </div>
              <h4>소속</h4>
              <p>분당경영고등학교</p>
            </div>
            <div className="about-card">
              <div className="card-icon">
                <FiMapPin />
              </div>
              <h4>위치</h4>
              <p>경기도 성남시</p>
            </div>
          </div>
        </div>

        {/* Tech Icons Infinite Slider */}
        <div className="tech-slider">
          <div className="tech-slider-track">
            {[...techIcons, ...techIcons].map((tech, i) => (
              <div className="tech-icon-item" key={i}>
                <img src={tech.icon} alt={tech.name} loading="lazy" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

