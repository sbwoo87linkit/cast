<div style="position: absolute; width: 20%; height:28px; border-bottom: 1px solid #ddd"></div>
<ul class="mu-tab" mu-tabset="ts2">
    <li mu-tab-item="" tab-activated="true">
        <a href="javascript:;">필드</a>
    </li>
    <li mu-tab-item="">
        <a href="javascript:;">필터</a>
    </li>
</ul>
<div class="mu-tab-body" mu-tabset="ts2">
    <div class="mu-tabCont" mu-tab-contents="">

        <!--side menu</p>-->
        <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">{{fieldList.length}}</span>
        </h5>
        <ul class="mu-slide-menu" id="containerLeft" class='containerVertical' style="margin-bottom: 100px">
            <li ng-repeat="field in fieldList" ng-class="field.name === analysis.selectedField.name ? 'active' : '' ">
                <a href="" ng-click="analysis.selectedField = field;clickItem(field)"
                   popup-layer-area="analysis.filter.add" layer-offset="{left: 2}"
                   layer-open="openedQueryLayer()" layer-close="closedQueryLayer()">
                    <i class="mu-icon-img"
                       ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                    <span ng-bind="field.name"></span>
                </a>
            </li>
        </ul>
    </div>
    <div class="mu-tabCont" mu-tab-contents="">
        <h5 class="mu-title tc">필터</h5>
        필터 UI
    </div>
</div>
<!-- 팝업 레이어: 시간 설정 -->
<div class="mu-tooltip right-top" style="width: 360px;" popup-layer="analysis.filter.add">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">
        <span class="title"><span>{{analysis.selectedField.name}}</span> </span>

        <div class="sample">
        </div>

        <div class="mu-item-group">
            <!--<textarea class="mu-area" ng-model="inputQuery"/>-->
            <table class="mu-formbox mu-formbox-vertical">
                <colgroup>
                    <col width="110">
                    <col width="120">
                    <col width="10">
                </colgroup>
                <!--<thead>-->
                <!--<tr>-->
                <!--<th colspan="2">E-Mail</th>-->
                <!--</tr>-->
                <!--</thead>-->
                <tbody>
                <tr>
                    <td>
                        <div class="mu-selectbox mu-select-sm">
                            <button class="mu-value">list default</button>
                            <ul class="mu-list">
                                <li value="1">list option1</li>
                                <li value="2">list option2</li>
                                <li value="3">list option3</li>
                                <li value="4">list option4</li>
                                <li value="5">list option5</li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="mu-input mu-input-default">
                    </td>
                    <td>
                        <!--<button ><i class="fa fa-minus-circle" aria-hidden="true"></i></button>-->
                        <!--<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>-->
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                    </td>
                </tr>

                </tbody>
            </table>
            <button><i class="mu-icon add"></i></button>
        </div>
        <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
            <button class="mu-btn btnApply fr" type="button" ng-click="changeQuery(inputQuery)"><spring:message code="save" /></button>
        </div>
    </div>
</div>
