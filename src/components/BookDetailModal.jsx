function BookDetailModal({ book, onClose }) {
  const isRented = book.id % 2 === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-image-area">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="modal-cover-image" />
          ) : (
            <div className="modal-fallback-cover">
              <h3 className="modal-fallback-title">{book.title}</h3>
              <p className="modal-fallback-author">{book.author}</p>
            </div>
          )}
        </div>

        <div className="modal-info-area">
          <h2 className="modal-book-title">{book.title}</h2>

          <p className="modal-author">
            저자: <span className="modal-author-name">{book.author}</span>
          </p>

          <div className="modal-divider"></div>

          <div className="modal-intro-title">📘 도서 요약</div>

          <p className="modal-description">
            {book.description ||
              "등록된 도서 요약이 없습니다. 도서 요약 설명을 입력하면 이 영역에 표시됩니다."}
          </p>

          <div className="modal-meta-row">
            <div className="modal-meta-item">
              <strong>출판 년도</strong>
              <span>{book.year ? `${book.year}년` : "정보 없음"}</span>
            </div>

            <div className="modal-meta-item">
              <strong>대출 여부</strong>
              <span className={isRented ? "modal-status-rent" : "modal-status-ok"}>
                {isRented ? "대출중" : "대출가능"}
              </span>
            </div>

            <div className="modal-meta-item">
              <strong>카테고리</strong>
              <span>{book.type || "단행본"}</span>
            </div>

            <div className="modal-meta-item modal-meta-item-last">
              <strong>ISBN</strong>
              <span>{book.isbn || "정보 없음"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailModal;
