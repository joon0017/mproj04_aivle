function ApiKey({ apiKey, onApiKeyChange }) {
    return (
        <div>
            <h1>API Key</h1>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="API키를 입력하세요"
            />
        </div>
    );
}

export default ApiKey;