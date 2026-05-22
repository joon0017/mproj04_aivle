import BookItem from './components/BookItem';
function Index() {
  return (
    <div className="page">
      <header className="header">
        <h1>대충 프로젝트 별명</h1>

        <nav className="nav">
          <span>크트츠</span>
          <span>크트츠</span>
          <span>내 정보</span>
          <div className="profile">🙄</div>
          <button>로그아웃</button>
        </nav>
      </header>

      <section className="search-area">
        <select>
          <option>전체</option>
        </select>

        <button className="category-btn">카테고리</button>

        <input className="search-input" />

        <button className="search-btn">검색</button>
      </section>

      <main className="content">
        <section className="book-list">
          <BookItem />
          <BookItem />
        </section>

        <aside className="side-box">
          <div className="side-title">최근 검색</div>
          <div className="side-empty"></div>

          <div className="side-title">sort</div>
          <ul>
            <li>서명순</li>
            <li>저자순</li>
            <li>발행년도(1 - 9)</li>
            <li>발행년도(9 - 1)</li>
          </ul>

          <div className="side-title">구분</div>

          <div className="filter-title">자료유형</div>
          <ul>
            <li>단행본</li>
          </ul>

          <div className="filter-title">저자</div>
          <ul>
            <li>...</li>
          </ul>

          <div className="filter-title">출판사</div>
          <ul>
            <li>...</li>
          </ul>

          <div className="filter-title">출판년도</div>
          <ul>
            <li>2020</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}

export default Index;