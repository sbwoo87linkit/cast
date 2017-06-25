<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>





<div ui-on-Drop="onDropField($event, $data, fieldOpts, 'yAxisField', 'right-top')" class="drop-container" style="height: 100%" layer-offset="{left: 2}">
<!--    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.yAxisField"
          style="position: absolute; top: 50%; left: 3%;
          -webkit-transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          text-overflow: ellipsis; white-space: nowrap">없음</span>
    <div class="field" ng-if="fieldOpts.drops.yAxisField" style="height: 100%">
        <button class="fr" ng-click="openPopup($event, 'adv.yAxisField.setting', 'right-top')"> > </button>
        <div style="height: calc(100% - 20px);">
            <div ui-on-Drop="preventDrop($event)" style="position: absolute;top: 50%; left: 3%;
                 -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                 transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                 text-overflow: ellipsis; white-space: nowrap">
                {{fieldOpts.drops.yAxisField.name}}
            </div>
        </div>
        <div>
            <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, fieldOpts, 'yAxisField')"></button>
        </div>
    </div>
</div>-->






<div ng-if="layout==='vertical'" ng-if="layout!='vertical'" ui-on-Drop="onDropField($event, $data, fieldOpts, '{{field.key}}', position)" class="drop-container"
     style="height: 100%" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!drops[field.key]"
          style="position: absolute; top: 50%; left: 3%;
          -webkit-transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          text-overflow: ellipsis; white-space: nowrap">없음{{drops[field.key]}}</span>
    <div class="field" ng-if="drops[field.key]" style="height: 100%">
        <button ng-if="position" class="fr" ng-click="openPopup($event, field.key, position)"> ></button>
        <div style="height: calc(100% - 20px);">
            <div ui-on-Drop="preventDrop($event)" style="position: absolute;top: 50%; left: 3%;
            -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
            transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
            text-overflow: ellipsis; white-space: nowrap">
                {{drops[field.key].name}}
            </div>
        </div>
        <div>
            <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                    ng-click="clearField($event, drops, field.key)"></button>
        </div>
    </div>
</div>

<div ng-if="layout==='vertical'">
    <%@ include file="./dropFieldPopup.jsp"%>
</div>




<div ng-if="layout!='vertical'" class="mu-row">

    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
        <span style="display: inline-block; margin-top: 6px">{{field.title}}</span>
    </div>

    <div class="mu-col mu-col-3">

        <div ng-if="layout!='vertical'" ui-on-Drop="onDropField($event, $data, fieldOpts, '{{field.key}}', position)" class="drop-container"
             layer-offset="{left: 2}">
            <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!drops[field.key]" style="">없음{{drops[field.key]}}</span>
            <div class="field" ng-if="drops[field.key]">
                <button ng-if="position" class="fr" ng-click="openPopup($event, field.key, position)"> ></button>
                <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                        ng-click="clearField($event, drops, field.key)"></button>
                <div>{{drops[field.key].name}}</div>
            </div>
        </div>

        <%@ include file="./dropFieldPopup.jsp"%>

    </div>

</div>
