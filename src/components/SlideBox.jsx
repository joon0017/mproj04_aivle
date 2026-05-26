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

  const typeCounts = getCountList("type");
  const authorCounts = getCountList("author");
  const publisherCounts = getCountList("publisher");
  const yearCounts = getCountList("year");

  return (
    <aside className="side-box">
      <section className="side-section">
        <div className="side-title">최근검색</div>

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
            등록입순
          </li>
        </ul>
      </section>

      <section className="side-section">
        <div className="side-title">구분</div>

        <FilterGroup title="Type" items={typeCounts} emptyLabel="Book" />
        <FilterGroup title="Author" items={authorCounts} />
        <FilterGroup title="Publisher" items={publisherCounts} emptyLabel="-" />
        <FilterGroup title="Year" items={yearCounts} emptyLabel="-" />
      </section>
    </aside>
  );
}

function FilterGroup({ title, items, emptyLabel = "No data" }) {
  return (
    <>
      <div className="filter-title">{title}</div>
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="count-badge">{item.count}</span>
            </li>
          ))
        ) : (
          <li>
            <span>{emptyLabel}</span>
          </li>
        )}
      </ul>
    </>
  );
}

export default SlideBox;
