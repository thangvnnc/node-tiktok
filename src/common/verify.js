'use strict'
class Verify {}
Verify.isUInt = function(str) {
    if (typeof str != "string") {
        return false;
    }
    var isInt = !isNaN(str) && !isNaN(parseInt(str));
    if (isInt === false) {
        return false;
    }
    return parseInt(str) > 0;
}

module.exports = Verify;