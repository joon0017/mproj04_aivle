import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchArea from "./components/SearchArea";
import SlideBox from "./components/SlideBox";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortType, setSortType] = useState("title");
  const [viewMode, setViewMode] = useState("main");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    type: "단행본",
    isbn: "",
    description: "",
  });

  const loadBooks = () => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setBooks(data);
          setSelectedBook(data[0]);
        }
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "title") return a.title.localeCompare(b.title, "ko");
    if (sortType === "author") return a.author.localeCompare(b.author, "ko");
    if (sortType === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const handleDeleteBook = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(`http://localhost:3000/books/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            const updatedBooks = books.filter((book) => book.id !== id);
            setBooks(updatedBooks);
            setSelectedBook(updatedBooks.length > 0 ? updatedBooks[0] : null);
          }
        })
        .catch((err) => console.error("삭제 실패:", err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.publisher) {
      alert("도서 제목, 저자, 출판사는 필수 입력 항목입니다.");
      return;
    }

    const newBookData = {
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      year: Number(formData.year) || new Date().getFullYear(),
      type: formData.type,
      isbn: formData.isbn,
      description: formData.description,
      createdAt: new Date().toISOString(),
    };

    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBookData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 저장 실패");
        return res.json();
      })
      .then((savedBook) => {
        alert("도서가 db.json에 성공적으로 저장되었습니다!");

        setBooks((prevBooks) => [...prevBooks, savedBook]);
        setSelectedBook(savedBook);

        setFormData({
          title: "",
          author: "",
          publisher: "",
          year: "",
          type: "단행본",
          isbn: "",
          description: "",
        });

        setViewMode("main");
      })
      .catch((err) => {
        console.error("도서 추가 실패:", err);
        alert("데이터베이스 저장에 실패했습니다. json-server를 확인하세요.");
      });
  };

  return (
    <div>
      <Header />

      {viewMode === "main" && (
        <div className="page app-page">
          <div className="menu-control-bar">
            <button className="global-add-btn" onClick={() => setViewMode("register")}>
              + 신규 도서 등록하기
            </button>
          </div>

          <main className="content main-layout">
            <div className="left-content list-section">
              <SearchArea />

              <h3 className="section-title">소장 도서 목록 ({books.length}권)</h3>

              <section className="book-list grid-container">
                {sortedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="book-click-area"
                    onClick={() => setSelectedBook(book)}
                  >
                    <BookItem book={book} isSelected={selectedBook?.id === book.id} />
                  </div>
                ))}

                {books.length === 0 && (
                  <div className="no-select">불러올 수 있는 도서 데이터가 없습니다.</div>
                )}
              </section>
            </div>

            <div className="right-panel">
              <div className="right-content detail-section">
                {selectedBook ? (
                  <div className="detail-panel">
                    <div className="panel-header">
                      <h3 className="section-title">상세 정보 및 관리</h3>

                      <div className="action-btn-group">
                        <button
                          className="edit-btn"
                          onClick={() => alert("수정 기능 연동 포인트")}
                        >
                          수정
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteBook(selectedBook.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    <div className="detail-card">
                      <h4 className="detail-title">📖 {selectedBook.title}</h4>

                      <table className="detail-table">
                        <tbody>
                          <tr>
                            <th>저자</th>
                            <td>{selectedBook.author}</td>
                          </tr>
                          <tr>
                            <th>출판사</th>
                            <td>{selectedBook.publisher}</td>
                          </tr>
                          <tr>
                            <th>출판년도</th>
                            <td>{selectedBook.year}년</td>
                          </tr>
                          <tr>
                            <th>도서 유형</th>
                            <td>{selectedBook.type || "단행본"}</td>
                          </tr>
                          <tr>
                            <th>ISBN</th>
                            <td>{selectedBook.isbn || "정보 없음"}</td>
                          </tr>
                        </tbody>
                      </table>

                      <h5 className="table-title">📍 실시간 현황 테이블</h5>

                      <table className="status-table">
                        <thead>
                          <tr>
                            <th>등록번호</th>
                            <th>소장처</th>
                            <th>대출상태</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>BR-00000{selectedBook.id}</td>
                            <td>제1자료실 (2층)</td>
                            <td>
                              <span
                                className={
                                  selectedBook.id % 2 === 0 ? "status-rent" : "status-ok"
                                }
                              >
                                {selectedBook.id % 2 === 0 ? "대출중" : "대출가능"}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="no-select">도서를 선택하면 상세 정보가 표시됩니다.</div>
                )}
              </div>

              <SlideBox books={books} sortType={sortType} setSortType={setSortType} />
            </div>
          </main>
        </div>
      )}

      {viewMode === "register" && (
        <div className="page app-page">
          <div className="form-container">
            <div className="form-header">
              <h2>📝 새 도서 소장 등록</h2>
              <button className="cancel-btn" onClick={() => setViewMode("main")}>
                뒤로 가기
              </button>
            </div>

            <form className="form-body" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>OpenAPI Key</label>
                <input
                  type="password"
                  name="openApiKey"
                  value={formData.openApiKey}
                  onChange={handleInputChange}
                  placeholder="OpenAPI 키를 입력하세요"
                />
              </div>
              
              <div className="form-group">
                <label>도서 제목 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="도서명을 입력하세요"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>저자 *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="저자명을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>출판사 *</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="출판사명을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>출판년도</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="예: 2026"
                  />
                </div>

                <div className="form-group">
                  <label>도서 유형</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="단행본">단행본</option>
                    <option value="eBook">eBook</option>
                    <option value="정기간행물">정기간행물</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>ISBN 번호</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="ISBN 13자리 번호를 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>도서 요약 설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="책에 대한 간략한 핵심 소개글을 적어주세요"
                  rows="3"
                />
              </div>

              <div className="form-action-row">
                <button
                  type="button"
                  className="form-cancel-btn"
                  onClick={() => setViewMode("main")}
                >
                  취소
                </button>
                <button type="submit" className="form-submit-btn">
                  도서 추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const BookItem = ({ book, isSelected }) => {
  return (
    <div className={`book-card ${isSelected ? "selected-card" : ""}`}>
      <BookInfo book={book} />

      <div className="badge-wrapper">
        <span className={book.id % 2 === 0 ? "badge-rent" : "badge-ok"}>
          {book.id % 2 === 0 ? "대출 중" : "소장 중"}
        </span>
      </div>
    </div>
  );
};

const BookInfo = ({ book }) => {
  return (
    <div className="info-flex">
      <div className="book-cover">📖</div>

      <div className="text-group">
        <h4 className="book-title">{book.title}</h4>
        <p className="book-meta">
          {book.author} · {book.publisher}
        </p>
        <p className="book-description">{book.description || book.content}</p>
      </div>
    </div>
  );
};

export default App;