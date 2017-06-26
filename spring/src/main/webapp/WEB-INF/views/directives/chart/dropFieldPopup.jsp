<div class="mu-tooltip top-right" style="width: 426px;" popup-layer="{{field.key}}{{index}}">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">
        <span class="title">{{drops[field.key].name}} - {{index}}</span>
        <div class="mu-search-item timeRelative">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <tr ng-repeat="row in field.rows">
                    <th>{{row.title}}</th>
                    <td>



                        <!--{{row}}-->




                        <div style="display:inline-block; border: 0px solid #999; margin: 2px;" ng-repeat="control in row.controls">


<!--
                            fillEmpty: {
                            title: '빠진값 채우기',
                            controls: {
                            first: {
                            type: 'dropdownExt',
                            selected: {},
                            options: [
                            { text: '채우지않음', value: 'not_fill', isSelected: true },
                            { text: '앞-뒤 평균', value: 'average' },
                            { text: '앞의 값', value: 'front_value' },
                            { text: '뒤의 값', value: 'rear_value' },
                            { text: '0', value: 'zero' },
                            { text: '사용자지정', value: 'userDefined' },
                            ],
                            extCondition: 'userDefined',
                            extOptions: [
                            {text: '범위크기', key: 'rangeSize', value: 'UNDEFINED'}
                            ]
                            }

                            }
                            }
-->

                            <div ng-if="control.type === 'dropdownExt'">
                                <div class="mu-selectbox" mu-select="" select-model="control.selected" select-items="control.options"
                                     select-change="changeOverlayField('add', $model)">
                                    <button class="mu-value">{{$model.text}}</button>
                                    <ul class="mu-list">
                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}
                                        </li>
                                    </ul>
                                </div>
                                <!--<input type="text" class="mu-input" ng-model="control.value" ng-if="control.selected.value==='userDefined'">-->

                                <div class="mu-item-group" ng-if="control.selected.value==='userDefined'" style="display: inline-block">
                                    <input type="text" class="mu-input" ng-model="control.extValue">
                                </div>

                                <!--<input type="text" ng-if="control.selected.value==='userDefined'">-->
                                <!--{{control.type}}-->
                                <!--{{control.selected}}-->
                            </div>



                            <div ng-if="control.type === 'buttonGroupExt'">
                                <div class="mu-btn-group" >
                                    <button ng-repeat="option in control.options" class="mu-btn" ng-class="{'active': option.value === control.selected}"
                                            ng-click="control.selected = option.value">
                                        {{option.text}}
                                    </button>
                                </div>
                                <div ng-if="control.selected === control.extCondition">
                                    <table>
                                        <tr ng-repeat="option in control.extOptions">
                                            <th>{{option.text}}</th>
                                            <td><input type="text" ng-model="option.value"></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <div ng-if="control.type === 'buttonGroup'">
                                <div class="mu-btn-group" >
                                    <button ng-repeat="option in control.options" class="mu-btn" ng-class="{'active': option.value === control.selected}"
                                            ng-click="control.selected = option.value">
                                        {{option.text}}
                                    </button>
                                </div>
                            </div>

                            <div ng-if="control.type === 'input'">
                                <div class="mu-item-group">
                                    <input type="text" class="mu-input" ng-model="control.value">
                                </div>
                            </div>

                            <div ng-if="control.type === 'checkbox'">
                                <div class="mu-item-group">
                                    <div class="mu-checkbox">
                                        <input type="checkbox" id="ckb_{{keyTab}}{{$index}}"
                                               ng-model="control.value">
                                        <label for="ckb_{{keyTab}}{{$index}}">
                                            {{control.text}}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div ng-if="control.type === 'dropdown'">
                                <div class="mu-selectbox" mu-select="" select-model="control.selected" select-items="control.options"
                                     select-change="changeOverlayField('add', $model)">
                                    <button class="mu-value">{{$model.text}}</button>
                                    <ul class="mu-list">
                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div ng-if="control.type === 'colorDropdown'">
                                <div class="mu-selectbox" mu-select="" select-model="control.selected" select-items="control.options"
                                     select-change="changeOverlayField('add', $model)">
                                    <button class="mu-value">
                                        <div style="display: inline-block; width: 70px;">{{$model.text}}</div>
                                        <div style="display: inline-block; height: 10px; width: 10px" ng-style="{'background' : $model.value}"></div>
                                    </button>
                                    <ul class="mu-list">
                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">
                                            <div style="display: inline-block; width: 70px;">{{opt.text}}</div>
                                            <div style="display: inline-block; height: 10px; width: 10px" ng-style="{'background' : opt.value}"></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>



                        </div>

                    </td>
                </tr>
                <!--                        <tr>
                                            <th>
                                                <label>정렬:</label>
                                            </th>
                                            <td>
                                                <div class="mu-selectbox" mu-select="sb1"
                                                     select-model="fieldOpts.opts.group.sort.selected"
                                                     select-items="fieldOpts.opts.group.sort.list" select-change="changeOption($model)">
                                                    <button class="mu-value">{{$model.text}}</button>
                                                    <ul class="mu-list">
                                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label>범위만들기:</label>
                                            </th>
                                            <td>
                                                <div class="mu-btn-group">
                                                    <button class="mu-btn"
                                                            ng-class="{'active': fieldOpts.opts.group.range.selected === 'auto'}"
                                                            ng-click="fieldOpts.opts.group.range.selected = 'auto'">자동계산
                                                    </button>
                                                    <button class="mu-btn"
                                                            ng-class="{'active': fieldOpts.opts.group.range.selected === 'userDefined'}"
                                                            ng-click="fieldOpts.opts.group.range.selected = 'userDefined'">사용자지정
                                                    </button>
                                                    <button class="mu-btn"
                                                            ng-class="{'active': fieldOpts.opts.group.range.selected === 'notUse'}"
                                                            ng-click="fieldOpts.opts.group.range.selected = 'notUse'">만들지 않음
                                                    </button>
                                                </div>
                                                <div ng-show="fieldOpts.opts.group.range.selected === 'userDefined'">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                범위크기
                                                            </td>
                                                            <td>
                                                                <input type="text"
                                                                       class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="fieldOpts.opts.group.range.userDefined.size">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위시작
                                                            </td>
                                                            <td>
                                                                <input type="text"
                                                                       class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="fieldOpts.opts.group.range.userDefined.start">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위끝
                                                            </td>
                                                            <td>
                                                                <input type="text"
                                                                       class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="fieldOpts.opts.group.range.userDefined.end">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>-->
                </tbody>
            </table>
        </div>

        <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
            <button class="mu-btn btnApply fr" type="button" ng-click="closePopup()">
                저장
            </button>
        </div>
    </div>
</div>
