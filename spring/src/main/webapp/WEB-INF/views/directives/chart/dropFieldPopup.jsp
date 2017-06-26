<div class="mu-tooltip top-right" style="width: 426px;" popup-layer="{{option.key}}{{index}}">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">
        <span class="title">{{field.name}} - {{option.key}}{{index}}</span>
        <div class="mu-search-item timeRelative">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <!--<div>{{option}}</div>-->
                <tr ng-repeat="row in option.rows">
                    <th>{{row.title}}</th>
                    <td>

                        <div style="display:inline-block; border: 0px solid #999; margin: 2px;" ng-repeat="control in row.controls">
                            <div ng-if="control.type === 'dropdownExt'">
                                <div class="mu-selectbox" mu-select="" select-model="control.selected" select-items="control.options"
                                     select-change="changeOverlayField('add', $model)">
                                    <button class="mu-value">{{$model.text}}</button>
                                    <ul class="mu-list">
                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}
                                        </li>
                                    </ul>
                                </div>
                                <div class="mu-item-group" ng-if="control.selected.value==='userDefined'" style="display: inline-block">
                                    <input type="text" class="mu-input" ng-model="control.extValue">
                                </div>
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
