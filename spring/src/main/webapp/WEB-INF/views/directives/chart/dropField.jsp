<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>


<!--<div ui-on-Drop="onDropField($event, $data, fieldOpts, 'yAxisField', 'right-top')" class="drop-container" style="height: 100%" layer-offset="{left: 2}">-->
<div ng-if="layout==='vertical'" class="drop-container" style="height: 100%" layer-offset="{left: 2}">

    <div ui-on-Drop="onDropField($event, $data, '{{field.key}}', {{index}})" class="drop-container"
         style="height: 100%; position: relative" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!drops[field.key]"
          style="position: absolute; top: 50%; left: 3%;
          -webkit-transform: translateX(0%) translateY(-50%)  rotate(-90deg);
          transform: translateX(0%) translateY(-50%)  rotate(-90deg);
          text-overflow: ellipsis; white-space: nowrap">없음{{drops[field.key]}}</span>
        <div class="field" ng-if="drops[field.key]" style="height: 100%">
            <button ng-if="showPopup!='false' && position" class="fr" ng-click="openPopup($event, field.key+index, position)"> ></button>
            <div style="height: calc(100% - 20px)">
                <div ui-on-Drop="preventDrop($event)" style="position: absolute;top: 50%; left: 3%;
            -webkit-transform: translateX(-30%) translateY(-50%) rotate(-90deg);
            transform:  translateX(-30%) translateY(-50%) rotate(-90deg);
            text-overflow: ellipsis; white-space: nowrap">
                    {{drops[field.key].name}} - {{index}}
                </div>
            </div>
            <div>
                <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                        ng-click="clearField($event, drops, field.key)"></button>
            </div>
        </div>
    </div>

    <div >
        <%@ include file="./dropFieldPopup.jsp"%>
    </div>
</div>


<div ng-if="layout!='vertical'" class="drop-container" style="height: 100%" layer-offset="{left: 2}">
    <!--{{field}}-->
    <!--{{option}}-->
    <div class="mu-row">

        <div class="mu-col mu-col-1" ng-if="showLabel != 'false'" style="text-align: right; padding-right: 10px;">
            <span style="display: inline-block; margin-top: 6px">{{option.title}}</span>
        </div>

        <div class="mu-col mu-col-{{colWidth}}">

            <div ui-on-Drop="onDropField($event, $data, '{{field.key}}', {{index}})" class="drop-container"
                 layer-offset="{left: 2}">
                <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!field" style="">없음</span>
                <button style="position: absolute" ng-if="middle==='true'" type="button" class="close fr" ng-click="deleteField(parentArray, index)"></button>
                <div class="field" ng-if="field">
                    <table style="width: 100%">
                        <tr>
                            <td style="width: 0">
                                <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                                        ng-click="clearField($event, field, index)"></button>
                            </td>
                            <td style="display:block; width: 100%; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{field.name}}</td>
                            <td style="width: 0">
                                <button ng-if="showPopup!='false' && position" class="fr" ng-click="openPopup($event, option.key+index, position)"> ></button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <%@ include file="./dropFieldPopup.jsp"%>

        </div>

    </div>
</div>