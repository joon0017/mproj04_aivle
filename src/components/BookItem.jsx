import './../App.css';

function BookItem({ title, author, content, coverImageUrl }) {
    const imageSrc = coverImageUrl || "https://via.placeholder.com/170x260?text=No+Image";

    return (
        <article className="book-item">
            <div className="cover">
                <img src={imageSrc} alt={title} />
            </div>

            <div className="book-info">
                <h2>{title}</h2>
                <div className="line"></div>

                <div className="desc">
                    <p>{content}</p>
                    <button className="detail-btn">상세정보</button>
                </div>
            </div>
        </article>
    );
}

export default BookItem;
