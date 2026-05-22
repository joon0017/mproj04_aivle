function BookItem({id, title, author, content, coverImageUrl, onDelete, onCreateImage,prompt}) {
    return <>
        <div className="cover">
            표지
            <br />
            img
        </div>

        <div className="book-info">
            <h2>제목</h2>
            <div className="line"></div>

            <div className="desc">
            txt
            <button className="detail-btn">소장정보</button>
            </div>
        </div>
        </>
}

export default BookItem;

/*
<h3>{title}</h3>
        <p>{author}</p>
        <p>{content}</p>
        <img src={coverImageUrl} alt='이미지가없습니다'/>
        <button onClick={()=> onDelete(id)}>삭제</button>
        <button onClick={()=> onCreateImage(id)}>이미지 생성</button>
            <div className="book-item"> 
            */