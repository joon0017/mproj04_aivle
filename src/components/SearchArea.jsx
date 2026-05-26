import "./SearchArea.css";

function SearchArea() {
  return (
    <section className="search-area">
      <select aria-label="Book category">
        <option>All</option>
        <option>Novel</option>
        <option>Major</option>
        <option>Literature</option>
        <option>IT</option>
      </select>

      <input
        className="search-input"
        placeholder="제목, 저자, 출판사 등으로 검색하세요"
      />

      <button className="search-btn">Search</button>
    </section>
  );
}

export default SearchArea;
