import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const timelineData = [
  {
    date: '진행 중',
    title: '분당경영고등학교 재학',
    desc: '분당경영고등학교 재학 중',
  },
  {
    date: '2025년',
    title: '카카오톡 봇 개발',
    desc: 'JavaScript / Graal.js 기반 카카오톡 자동 응답 봇 개발',
  },
  {
    date: '2025년',
    title: '벽돌깨기 웹 게임 개발',
    desc: '타이핑으로 벽돌을 깨는 영어 학습 웹 게임 제작',
  },
  {
    date: '2025년',
    title: '치지직 크롬 확장 프로그램',
    desc: '치지직 플랫폼용 크롬 확장 프로그램 개발 및 배포',
  },
  {
    date: '2025년',
    title: '데이터베이스 프로젝트',
    desc: 'Java와 Oracle DB를 활용한 데이터베이스 관리 시스템 개발',
  },
];

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Timeline() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="timeline" className="section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">Timeline</div>
        <h2 className="section-title">성장 과정</h2>
        <p className="section-desc">저의 성장 과정을 소개합니다.</p>

        <div className="timeline-container">
          {timelineData.map((item, i) => (
            <motion.div
              className="timeline-item"
              key={i}
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={itemVariants}
            >
              <div className="timeline-dot" />
              <div className="timeline-date">{item.date}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
