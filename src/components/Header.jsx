import "./Header.css";
import logo from "../assets/DocumentLogo.png";

function Header() {
  return (
    <header className="header">
      <div className="logo-area">
        <img src={logo} alt="AI document library logo" />
        <p>AI 도서관리 시스템</p>
      </div>

      <nav className="nav" aria-label="User">
        <div className="profile">Guest</div>
      </nav>
    </header>
  );
}

export default Header;
