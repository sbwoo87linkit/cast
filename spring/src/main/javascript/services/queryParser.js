'use strict';
/**
 *
 */
var _ = require('lodash');
/**
 *
 */
queryParser.$inject = ['DEFAULT'];
function queryParser(DEFAULT) {
    /**
     *  constant
     */
    var REGEXP_SEP = /\s*\|\s*/;
    var commands = [
        'fields',
        'head',
        'pivot',
        'rename',
        'search',
        'sort',
        'top',
        'sql',
        'stats',
        'timeline',
        'where'
    ];
    var REGEXP_CMD_PIECE = new RegExp('(' + commands.join('|') + ')\\s+(.+)');

    var _parse = {
        fields: function (str) {
            // 미구현
            return str;
        },
        head: function (str) {
            // 미구현
            return str;
        },
        pivot: function (str) {
            // 미구현
            return str;
        },
        rename: function (str) {
            // 미구현
            return str;
        },
        search: function (str) {
            // 미구현
            return str;
        },
        sort: function (str) {
            var mg = /(\d+)?\s+(\+|-)?(.+)/.exec(str);
            if (!mg) {
                return str;
            }

            var rst = {};
            if (mg[1]) {
                rst.N = +(mg[1]);
            }
            rst.order = (mg[2] === '-') ? 'desc' : 'asc';
            rst.field = mg[3];

            return rst;
        },
        top: function (str) {
            // 미구현
            return str;
        },
        sql: function (str) {
            // 미구현
            return str;
        },
        stats: function (str) {
            // 미구현
            return str;
        },
        timeline: function (str) {
            // 미구현
            return str;
        },
        where: function (str) {
            return str;
        }
    };
    /**
    *   functions
    */
    function serialize() {
        return '미구현';
    }

    function parse(query) {
        var states = {};

        if (!query || query.trim() === DEFAULT.QUERY) {
            return states;
        }

        var sp = query.split(REGEXP_SEP);

        _.forEach(sp, function (piece) {
            var mg = REGEXP_CMD_PIECE.exec(piece);
            if (mg) {
                var cmd = mg[1];
                var etc = mg[2];
                states[cmd] = _parse[cmd](etc);
            }
        });

        return states;
    }

    function toString() {
        return '미구현';
    }
    /**
     *   exports
     */
    return {
        serialize: serialize,
        parse: parse,
        toString: toString,
    };

}
/**
*
*/
module.exports = queryParser;
