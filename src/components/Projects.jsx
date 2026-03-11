import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';

const projects = [
  {
    title: '카카오톡 봇',
    desc: '카카오톡에서 다양한 기능을 제공하는 자동 응답 봇입니다. Graal.js 기반으로 개발되었습니다.',
    tags: ['JavaScript', 'Graal.js', 'KakaoTalk'],
    link: 'https://open.kakao.com/o/swfbP3Yh',
    linkText: '대화하기',
  },
  {
    title: '벽돌깨기 웹 게임',
    desc: '타이핑으로 벽돌을 깨는 웹 게임입니다. 영어 학습과 게임을 결합한 교육용 프로젝트입니다.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://github.com/MoonJunSung/English-crash-game',
    linkText: '코드 보기',
  },
  {
    title: '치지직 확장 프로그램',
    desc: '치지직 플랫폼을 위한 크롬 확장 프로그램입니다. 더 나은 시청 경험을 제공합니다.',
    tags: ['JavaScript', 'HTML', 'Chrome Extension'],
    link: 'https://chromewebstore.google.com/detail/papendaomoehobckhanogifeejnpimee',
    linkText: '설치하기',
  },
  {
    title: '데이터베이스 프로젝트',
    desc: 'Java와 Oracle을 활용한 데이터베이스 관리 시스템입니다.',
    tags: ['Java', 'Oracle', 'SQL'],
    link: '#',
    linkText: '코드 보기',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">Projects</div>
        <h2 className="section-title">프로젝트</h2>
        <p className="section-desc">제가 만든 프로젝트들을 소개합니다.</p>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.a
              className="project-card"
              key={i}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={cardVariants}
              whileHover={{ y: -8 }}
            >
              <h3>{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <span className="project-link">
                {project.linkText} <FiArrowRight />
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

