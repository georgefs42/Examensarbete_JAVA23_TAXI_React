import '../css/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-links">
          <a href="/hero">Booking</a>
          <a href="/main">About</a>
        
        
          <p>&copy; {new Date().getFullYear()} Stockholm Taxi och Åkeri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
