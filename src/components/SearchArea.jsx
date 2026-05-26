import "./SearchArea.css";

function SearchArea() {
    return (
        <section className="search-area">

        <select>
          <option>전체</option>
          <option>소설</option>
          <option>전공서</option>
          <option>문학</option>
          <option>IT</option>
        </select>

        <input className="search-input" placeholder="도서 제목, 저자, 출판사로 검색하세요" />

        <button className="search-btn">검색</button>
      </section>
    );
}

export default SearchArea;