import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© <span id="year">{new Date().getFullYear()}</span> 문준성. All rights reserved.</p>
    </footer>
  );
}

