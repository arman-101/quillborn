import React from 'react';
import { Twitter, Instagram } from 'lucide-react'; // Import icons from Lucide
import './Footer.css'; // For custom styling

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Automatically get the current year

  return (
    <footer className="footer">
      <div className="footer-icons">
        <button aria-label="Twitter" className="footer-icon-link" onClick={() => window.location.href = '#'}>
          <Twitter size={32} />
        </button>
        <button aria-label="Instagram" className="footer-icon-link" onClick={() => window.location.href = '#'}>
          <Instagram size={32} />
        </button>
      </div>
      <p className="footer-copyright">© {currentYear} QuillBorn Ltd.</p>
    </footer>
  );
};

export default Footer;
