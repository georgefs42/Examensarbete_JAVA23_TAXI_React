import '../css/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-links">
          <a href="/hero">Home</a>
          <a href="/main">About</a>
          <a href="/main">Work with us</a>
          <a href="/main">Login/Out</a>
        
        
          <p>&copy; {new Date().getFullYear()} Stockholm Taxi och Åkeri. All rights reserved.</p>
          <p><a href="https://georgedev.se" target="_blank">georgedev.se</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
