import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skillCategories = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'HTML', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
      { name: 'CSS', icon: 'https://cdn.simpleicons.org/css/1572B6' },
      { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
      { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
    ],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
      { name: 'Java', icon: 'https://cdn.simpleicons.org/openjdk/FFFFFF' },
      { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
    ],
  },
  {
    title: 'Database',
    icon: '🗄️',
    skills: [
      { name: 'Oracle', icon: 'https://cdn.simpleicons.org/oracle/F80000' },
    ],
  },
  {
    title: 'Tools & DevOps',
    icon: '🛠️',
    skills: [
      { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/FFFFFF' },
      { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/646CFF' },
      { name: 'VS Code', icon: 'https://cdn.simpleicons.org/vscodium/007ACC' },
    ],
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

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">Skills &amp; Technologies</div>
        <h2 className="section-title">기술 스택</h2>
        <p className="section-desc">
          끊임없이 새로운 기술을 학습하고 프로젝트에 적용하며 성장하고 있습니다.
        </p>

        <div className="skills-grid">
          {skillCategories.map((cat, i) => (
            <motion.div
              className="skill-category"
              key={cat.title}
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={cardVariants}
            >
              <h3>
                <span className="cat-icon">{cat.icon}</span>
                {cat.title}
              </h3>
              <ul className="skill-list">
                {cat.skills.map((skill) => (
                  <li className="skill-item" key={skill.name}>
                    <img src={skill.icon} alt={skill.name} loading="lazy" />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
