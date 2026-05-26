import "./Header.css";
import logo from '../assets/DocumentLogo.png';

function Header() {
    return (
        <header className="header">
            <div className="logo-area">
                <img src={logo} alt="AI 도서관리 로고" />
                <p>AI 도서관리 시스템</p>
            </div>
            
            <nav className="nav">
                <div className="profile">Guest</div>
            </nav>
        </header>
    )
}

export default Header;