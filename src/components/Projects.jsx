import React from 'react';

const projects = [
  {
    title: '카카오톡 봇 개발',
    desc: '카카오톡 봇 개발. 주요 기술: JavaScript, Graal.js',
    link: 'https://open.kakao.com/o/swfbP3Yh',
    linkText: '대화하기'
  },
  {
    title: '데이터베이스',
    desc: '데이터베이스 개발. 주요 기술: Java, Oracle',
    link: '#',
    linkText: '코드'
  },
  {
    title: '벽돌깨기',
    desc: '타이핑으로 벽돌을 깨는 웹 게임. 주요 기술: HTML, CSS, JavaScript',
    link: 'https://github.com/MoonJunSung/English-crash-game',
    linkText: '코드'
  },
  {
    title: '확장 프로그램 개발',
    desc: '치지직 확장 프로그램 개발. 주요 기술: JavaScript, HTML',
    link: 'https://chromewebstore.google.com/detail/papendaomoehobckhanogifeejnpimee?utm_source=item-share-cb',
    linkText: '설치하기'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2>프로젝트</h2>
      <div className="projects">
        {projects.map((project, index) => (
          <article className="card" key={index}>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <a className="card-link" href={project.link} target="_blank" rel="noopener noreferrer">
              {project.linkText}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

