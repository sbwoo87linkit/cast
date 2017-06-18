<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>


<div class="mu-row">

    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
        <span style="display: inline-block; margin-top: 6px">{{field.title}}</span>
    </div>

    <div class="mu-col mu-col-3">

        <div ui-on-Drop="onDropField($event, $data, fieldOpts, '{{field.key}}', 'bottom-right')" class="drop-container"
             layer-offset="{left: 2}">
            <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.groupField" style="">없음</span>
            <div class="field" ng-if="fieldOpts.drops.groupField">
                <button class="fr" ng-click="openPopup($event, '{{field.key}}', 'top-right')"> ></button>
                <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                        ng-click="clearField($event, fieldOpts, 'groupField')"></button>
                <div>{{fieldOpts.drops.groupField.name}}</div>
            </div>
        </div>

        <div class="mu-tooltip top-right" style="width: 426px;" popup-layer="{{field.key}}">
            <div class="arrow"></div>
            <div class="mu-tooltip-inner">
                <span class="title">{{fieldOpts.drops.groupField.name}}</span>
                <div class="mu-search-item timeRelative">

                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                        <tr ng-repeat="row in field.rows">
                            <th>{{row.title}}</th>
                            <td>
                                {{row}}
                                <div style="display:inline-block; border: 0px solid #999; margin: 2px;" ng-repeat="control in row.controls">


                                    <div ng-if="control.type === 'buttonGroupExt'">
                                        <div class="mu-btn-group" >
                                            <button ng-repeat="option in control.options" class="mu-btn" ng-class="{'active': option.value === control.selected}"
                                                    ng-click="control.selected = option.value">
                                                {{option.text}}
                                            </button>
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
                    <button class="mu-btn btnApply fr" type="button" ng-click="closePopup(field.key)">
                        저장
                    </button>
                </div>
            </div>
        </div>

    </div>

</div>
