'use strict';
/**
 *
 */
/**
 *
 */
module.exports = {
    PING_INTERVAL: 60 * 1000,
    RESIZE_INTERVAL: 0.2 * 1000,

    QUERY: '*',

    TIME_UNIT: '1H',
    TIME_START: '-1w',
    TIME_END: 'now',

    ALIGN: 'asc',
    CHART_LIMIT_NUM: 500,
    OVER_PARTITION_NUM: 100,
    SEARCH_MAX_COUNT: 1000,
    PIVOT_MAX_COUNT: 500,
    TIMELINE_MAX_COUNT: 500,

    TO_FIXED_NUM: 6,

    DOWNLOAD: {
        FILE_NAME: 'download',
        MIN_COUNT: 1,
        MAX_COUNT: 1000
    },

    HISTORY_MAX_COUNT: 10,
    COOKIE: {
        SRCH_ASSI: 'isAutoOpenSrchAssi',
        SRCH_SLT_FILEDS: 'selectedFields'
    },

    GRID: {
        COL_WIDTH: 200,
        ROW_HEIGHT: 29
    },

    STORAGE_TYPE: {
        TABLE: 'iris',
        HDFS: 'hdfs'
    },
    HDFS_FILE_FORMAT: 'csv',
    HDFS_FILE_SEP: ',' // ex) ',' '|^|', ...
};
