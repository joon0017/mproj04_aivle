import "./BookItem.css";

function BookItem({ book, index }) {
  const imageSrc = book.coverImageUrl || book.cover;
  const category = book.category || book.type || "Book";
  const description = book.description || book.content || "No description.";
  const tags = book.tags || [category].filter(Boolean);

  return (
    <article className="book-item">
      <div className="book-rank">{index + 1}</div>

      <div className="book-cover">
        {imageSrc ? (
          <img src={imageSrc} alt={book.title} />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="book-content">
        <div className="book-title-row">
          <h2>{book.title}</h2>
          <span className="book-type">{category}</span>
        </div>

        <div className="book-meta">
          <span>{book.author} 지음</span>
          {book.publisher && (
            <>
              <span>|</span>
              <span>{book.publisher}</span>
            </>
          )}
          {book.year && (
            <>
              <span>|</span>
              <span>{book.year}</span>
            </>
          )}
        </div>

        <p className="book-description">{description}</p>

        <div className="book-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <button className="book-detail-btn">소장정보</button>
      {/* 소장정보 버튼 클릭 시 상세정보 페이지로 이동 */}
    </article>
  );
}

export default BookItem;
