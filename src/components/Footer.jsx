import '../css/home/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about/About">About</a>
          <a href="/work/Work">Work with us</a>

          <p>&copy; {new Date().getFullYear()} Stockholm Taxi och Åkeri. All rights reserved.</p>
          <p><a href="https://georgedev.se" target="_blank">georgedev.se</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
