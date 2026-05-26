function BookFormPage({
  mode,
  formData,
  generatedImage,
  isGenerating,
  onInputChange,
  onGenerateImage,
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === "edit";

  return (
    <div className="page-modifier">
      <div className="register-layout">
        <div className="image-preview-side">
          <h3 className="preview-title">
            {isEditMode ? "📕 도서 표지" : "✨ AI 표지 디자인"}
          </h3>

          <div className="image-box">
            {isGenerating ? (
              <div className="loading-state">
                <div className="spinner">⏳</div>
                <p>AI가 표지를 디자인하고 있습니다...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="도서 표지" className="generated-img" />
            ) : (
              <div className="empty-state">
                <p>
                  {isEditMode ? (
                    <>등록된 표지 이미지가 없습니다.</>
                  ) : (
                    <>
                      도서 정보를 바탕으로
                      <br />
                      AI가 표지를 만들어줍니다.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {!isEditMode && (
            <div className="ai-action-row">
              {!generatedImage ? (
                <button
                  type="button"
                  onClick={onGenerateImage}
                  className="ai-generate-btn"
                >
                  🎨 AI 이미지 미리보기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGenerateImage}
                  className="ai-regenerate-btn"
                >
                  🔄 이미지 재생성
                </button>
              )}
            </div>
          )}
        </div>

        <div className="form-side">
          <div className="form-header">
            <h2 className="form-title">
              {isEditMode ? "✏️ 내용 수정" : "📝 새 도서 소장 등록"}
            </h2>

            <button onClick={onCancel} className="cancel-btn">
              뒤로 가기
            </button>
          </div>

          <form onSubmit={onSubmit} className="form-body">
            {!isEditMode && (
              <div className="form-group">
                <label>OpenAPI Key</label>
                <input
                  type="password"
                  name="openApiKey"
                  value={formData.openApiKey || ""}
                  onChange={onInputChange}
                  placeholder="OpenAPI 키를 입력하세요"
                />
              </div>
            )}

            <div className="form-group">
              <label>도서 제목 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="도서명을 입력하세요"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>저자 *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={onInputChange}
                  placeholder="저자명을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label>출판사 *</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={onInputChange}
                  placeholder="출판사를 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>출판년도</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={onInputChange}
                  placeholder="2026"
                />
              </div>

              <div className="form-group">
                <label>도서 유형</label>
                <select name="type" value={formData.type} onChange={onInputChange}>
                  <option value="단행본">단행본</option>
                  <option value="eBook">eBook</option>
                  <option value="정기간행물">정기간행물</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>ISBN 번호</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={onInputChange}
                placeholder="ISBN 13자리 번호를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>도서 요약 설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="책에 대한 간략한 핵심 소개글을 적어주세요"
                rows="4"
              />
            </div>

            <div className="form-action-row">
              <button type="button" onClick={onCancel} className="form-cancel-btn">
                취소
              </button>

              <button
                type="submit"
                className={isEditMode ? "edit-submit-btn" : "form-submit-btn"}
              >
                {isEditMode ? "수정하기" : "도서 추가하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookFormPage;
