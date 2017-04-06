'use strict';
/**
 *
 */
/**
 *  검색 -> 이상탐지 이동을 위한 구조체 저장 factory (임시)
 */
Anomaly.$inject = [];
function Anomaly() {
    /**
    *   variables
    */
    var _keyFields = [];
    var _valFields = [];
    var _model = 'SPC'; // default
    /**
    *   method
    */
    this.clean = function () {
        _keyFields = [];
        _valFields = [];
        _model = 'SPC'; // default
        return this;
    };
    this.get = function () {
        return {
            keyFields: _keyFields,
            valFields: _valFields,
            model: _model
        };
    };
    this.set = function (props, slient) {
        _keyFields = props.keyFields || [];
        _valFields = props.valFields || [];
        _model = props.model || 'SPC';

        if (slient) {
            // ...
        }
        return this;
    };

    return this;
}
/**
*   exports
*/
module.exports = Anomaly;
