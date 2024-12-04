class ValidationError extends Error {
    /**
     * 無效參數錯誤訊息
     * @param {String} message - 錯誤訊息
     * @param {String} code - 錯誤代碼
     * @param {Object} errors - 其他詳細錯誤訊息 (選填)
     */
    constructor(message, code, errors = {}) {
        super(message);

        this.code = code;
        this.errors = errors;
    }
}

module.exports = {
    ValidationError,
};