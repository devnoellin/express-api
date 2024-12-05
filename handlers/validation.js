/**
 * 驗證排序欄位名稱是否合法
 * @param {string} sort - 排序欄位名稱
 * @param {Array<string>} validFields - 可用欄位名稱列表
 * @returns {boolean} - 是否為有效的欄位名稱
 */
const isValidSortField = (sort, validFields) => {
    return validFields.includes(sort);
};

/**
 * 驗證排序欄位名稱是否合法
 * @param {string} order - 排序欄位名稱
 * @returns {boolean} - 是否為有效的排序欄位名稱
 */
const isValidOrder = (order) => {
    const validOrders = ['asc', 'desc'];

    return validOrders.includes(order.toLowerCase());
};

/**
 * 驗證是否為純數字
 * @param {string | number} value - 需檢核的值
 * @returns {boolean}
 */
const isNumber = (value) => {
    const regex = /^\d+$/;

    return regex.test(value);
};

module.exports = {
    isValidSortField,
    isValidOrder,
    isNumber,
};