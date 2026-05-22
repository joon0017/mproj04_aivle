function BookItem({id, title, author, content, coverImageUrl, onDelete, onCreateImage,prompt}) {
    return <li>
        <h3>{title}</h3>
        <p>{author}</p>
        <p>{content}</p>
        <img src={coverImageUrl} alt='이미지가없습니다'/>
        <button onClick={()=> onDelete(id)}>삭제</button>
        <button onClick={()=> onCreateImage(id)}>이미지 생성</button>
    </li>
}

export default BookItem;
