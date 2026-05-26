import "./SlideBox.css";

function SlideBox({ books = [], sortType, setSortType }) {
  const getCountList = (key) => {
    const countMap = {};

    books.forEach((book) => {
      const value = book[key];

      if (!value) return;

      if (key === "author") {
        value.split(",").forEach((name) => {
          const authorName = name.trim();

          if (!authorName) return;

          countMap[authorName] = (countMap[authorName] || 0) + 1;
        });
      } else {
        countMap[value] = (countMap[value] || 0) + 1;
      }
    });

    return Object.entries(countMap).map(([name, count]) => ({
      name,
      count,
    }));
  };

  return (
    <aside className="side-box">
      <section className="side-section">
        <div className="side-title">최근 검색</div>

        <div className="recent-tags">
          <span className="recent-tag">데이터베이스</span>
          <span className="recent-tag">SQL</span>
        </div>
      </section>

      <section className="side-section">
        <div className="side-title">정렬</div>

        <ul>
          <li
            className={sortType === "title" ? "active" : ""}
            onClick={() => setSortType("title")}
          >
            서명순
          </li>

          <li
            className={sortType === "author" ? "active" : ""}
            onClick={() => setSortType("author")}
          >
            저자순
          </li>

          <li
            className={sortType === "createdAt" ? "active" : ""}
            onClick={() => setSortType("createdAt")}
          >
            등록일순
          </li>
        </ul>
      </section>

      <section className="side-section">
        <div className="side-title">구분</div>

        <div className="filter-title">자료유형</div>
        <ul>
          {getCountList("type").map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="count-badge">{item.count}</span>
            </li>
          ))}
        </ul>

        <div className="filter-title">저자</div>
        <ul>
          {getCountList("author").map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="count-badge">{item.count}</span>
            </li>
          ))}
        </ul>

        <div className="filter-title">출판사</div>
        <ul>
          {getCountList("publisher").map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="count-badge">{item.count}</span>
            </li>
          ))}
        </ul>

        <div className="filter-title">출판년도</div>
        <ul>
          {getCountList("year").map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="count-badge">{item.count}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default SlideBox;