
<div class="mu-dialog-body" ng-show="activeTabSet === 'defaultTab'" style="overflow: visible">
    <!-- 탭 목록 (좌측) -->
    <ul class="mu-tab mu-tab-vertical" mu-tabset="defaultTab">
        <li mu-tab-item="" ng-repeat="tab in tabs">
            <a href="javascript:;">{{tab}}</a>
        </li>
    </ul>

    <div class="mu-tab-body" mu-tabset="defaultTab">
        <div class="mu-tabCont" mu-tab-contents="" ng-repeat="(keyTab, tab) in chartOpts">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <tr ng-repeat="(key, row) in tab">
                    <th>
                        {{row.text}}
                    </th>
                    <td>
                        <div style="display:inline-block; border: 0px solid #999; margin: 2px;" ng-repeat="control in row.controls">

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

                            <div ng-if="control.type === 'label'">
                                <div class="mu-item-group">
                                    <span ng-bind="control.value"></span>
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
    </div>

</div>
