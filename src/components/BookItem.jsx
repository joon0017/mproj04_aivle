import "./BookItem.css";

function BookItem({ book, index }) {
  return (
    <article className="book-item">
      <div className="book-rank">{index + 1}</div>

      <div className="book-cover">
        <img src={book.cover} alt={book.title} />
      </div>

      <div className="book-content">
        <div className="book-title-row">
          <h2>{book.title}</h2>
          <span className="book-type">{book.category}</span>
        </div>

        <div className="book-meta">
          <span>{book.author} 지음</span>
          <span>|</span>
          <span>{book.publisher}</span>
          <span>|</span>
          <span>{book.year}</span>
        </div>

        <p className="book-description">{book.description}</p>

        <div className="book-tags">
          {book.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <button className="book-detail-btn">
        소장정보
      </button>
    </article>
  );
}

export default BookItem;