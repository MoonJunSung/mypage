import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="section">
      <h2>연락</h2>
      <p>이메일: <a href="mailto:s25-20404@bundang.mgt.hs.kr">s25-20404@bundang.mgt.hs.kr</a></p>
      <form id="contactForm" className="contact-form" action="https://formspree.io/f/xldwdken" method="POST">
        <label>
          이름
          <input name="name" type="text" required />
        </label>
        <label>
          이메일
          <input name="email" type="email" required />
        </label>
        <label>
          메시지
          <textarea name="message" rows="5" required></textarea>
        </label>
        <button className="btn primary" type="submit">보내기</button>
      </form>
    </section>
  );
}

