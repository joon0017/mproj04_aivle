function BookDetailsPanel({
  selectedBook,
  isPreviewing = false,
  onEditClick,
  onDeleteBook,
  onToggleRent, // ✨ 1. Props로 함수 받기 추가
}) {
  if (!selectedBook) {
    return (
      <div className="no-select">
        도서를 선택하면 상세 정보가 표시됩니다.
      </div>
    );
  }

  // ✨ 2. 짝수/홀수 하드코딩 제거 및 실제 DB 데이터 연동
  const isRented = selectedBook.isAvailable === false;
  const bookCode = `BR-${String(selectedBook.id).padStart(5, "0")}`;

  return (
    <div className="sticky-panel">
      <div className="panel-header">
        <div>
          <h3 className="section-title-right">상세 정보 및 관리</h3>
        </div>

        {!isPreviewing && (
          <div className="action-btn-group">
            <button onClick={onEditClick} className="edit-btn">
              수정
            </button>

            {/* ✨ 3. 대여 버튼에 onClick 이벤트 추가 및 상태별 텍스트 변경 */}
            <button 
              type="button" 
              className="rent-btn"
              onClick={() => onToggleRent(selectedBook.id, selectedBook.isAvailable)}
            >
              {isRented ? "반납" : "대여"}
            </button>

            <button
              onClick={() => onDeleteBook(selectedBook.id)}
              className="delete-btn"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="detail-card">
        <h4 className="detail-title">📘 {selectedBook.title}</h4>

        <table className="detail-table">
          <tbody>
            <tr>
              <th>저자</th>
              <td>{selectedBook.author || "정보 없음"}</td>
            </tr>

            <tr>
              <th>출판사</th>
              <td>{selectedBook.publisher || "정보 없음"}</td>
            </tr>

            <tr>
              <th>출판년도</th>
              <td>{selectedBook.year ? `${selectedBook.year}년` : "정보 없음"}</td>
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
              <td>{bookCode}</td>
              <td>제1자료실 (2층)</td>
              <td>
                <span className={isRented ? "status-rent" : "status-ok"}>
                  {isRented ? "대출중" : "대출가능"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookDetailsPanel;