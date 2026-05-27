import BookDetailsPanel from "../components/BookDetailsPanel";
import ShelfSection from "../components/ShelfSection";

function MainPage({
  books = [],
  totalBooksCount = 0,
  selectedBook,
  sortType,
  onSortChange,
  searchTerm,
  onSearchChange,
  onRegisterClick,
  onEditClick,
  onDeleteBook,
  onBookClick,
  onBookDoubleClick,
}) {
  const recentBooks = books.slice(0, 3);

  return (
    <div className="main-page">
      <aside className="left-sidebar">
        <div className="logo-area">
          <div className="logo-icon">🤖</div>
          <h1>AI 도서관리 시스템</h1>
        </div>

        <nav className="nav-menu">
          <button className="nav-item">🏠 홈</button>
        </nav>

        <div className="recent-box">
          <h3>최근 등록된 책</h3>

          <div className="recent-list">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="recent-item"
                onClick={() => onBookClick(book)}
              >
                <div className="recent-cover">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} />
                  ) : (
                    <span>{book.title?.slice(0, 2)}</span>
                  )}
                </div>

                <div>
                  <strong>{book.title}</strong>
                  <p>{book.author}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="recent-more-btn">전체 보기 →</button>
        </div>

        <div className="user-box">
          <div className="user-icon">👤</div>
          <div>
            <strong>Admin</strong>
            <p>관리자</p>
          </div>
        </div>
      </aside>

      <main className="main-center">
        <header className="top-search-area">
          <div className="search-box">
            <select
              value={sortType}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="title">제목순</option>
              <option value="author">저자순</option>
              <option value="createdAt">최근 등록순</option>
            </select>

            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="도서 제목, 저자, 출판사로 검색하세요"
            />

            {searchTerm ? (
              <button
                type="button"
                className="clear-btn"
                onClick={() => onSearchChange("")}
              >
                ×
              </button>
            ) : (
              <div />
            )}

            <button type="button" className="search-btn">
              검색
            </button>
          </div>

          <button className="register-btn" onClick={onRegisterClick}>
            + 신규 도서 등록하기
          </button>
        </header>

        <section className="main-shelf-area">
          <div className="main-shelf-title">
            <h2>전체 도서</h2>
            <span>총 {totalBooksCount}권</span>
          </div>

          <div className="shelf-scroll-area">
            <ShelfSection
              title=""
              books={books}
              selectedBook={selectedBook}
              onBookClick={onBookClick}
              onBookDoubleClick={onBookDoubleClick}
              onBookHover={() => {}}
              onBookLeave={() => {}}
            />
          </div>
        </section>
      </main>

      <aside className="right-panel">
        <BookDetailsPanel
          selectedBook={selectedBook}
          onEditClick={onEditClick}
          onDeleteBook={onDeleteBook}
        />
      </aside>
    </div>
  );
}

export default MainPage;