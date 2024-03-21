/**
 * Convert object into SQL UPDATE query string
 * @param {Object} src 
 * @returns {string}
 */
function objToSQLUpdateQueryString(src) {
    let resultStr = '';
    let objLength = Object.keys(src).length;

    if(objLength === 0) {
        return resultStr;
    }

    let resultArr = [];
    for(let i = 1; i <= objLength; i++) {
        const keys = Object.keys(src)[i-1];
        resultArr.push(`${keys} = \$${i}`);
    }

    resultStr = concateStringFromArray(resultArr, ', ');
    return resultStr;
}

/**
 * Concate string array to a string
 * @param {Array} src 
 * @param {string} delim 
 * @returns {string}
 */
function concateStringFromArray(src, delim) {
    let result = '';
    for(let i = 0; i < src.length; i++) {
        result += src[i];
        if(i !== src.length-1) {
            result += delim;
        }
    }

    return result;
}

module.exports = {
    objToSQLUpdateQueryString
}
