'use strict';
/**
 *
 */
/**
*
*/
convType.$inject = [];
function convType() {
    var typeMap = {
        // IRIS types
        REAL: 'NUMBER',
        NUMBER: 'NUMBER',
        TEXT: 'TEXT',
        INTEGER: 'NUMBER',

        // Angora types
        BYTE: 'NUMBER',
        SHORT: 'NUMBER',
        LONG: 'NUMBER',
        FLOAT: 'NUMBER',
        BINARY: 'TEXT',
        BOOLEAN: 'TEXT',
        TIMESTAMP: 'TIMESTAMP',
        DATE: 'TIMESTAMP'
    };

    return function(type) {
        return (typeMap[type] || 'unknown');
    };
}

module.exports = convType;
