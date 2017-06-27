<!--<table style="height: 100%; background: beige" ng-if="layout==='vertical'">-->
    <!--<tr>-->
        <!--<td> > </td>-->
    <!--</tr>-->
    <!--<tr>-->
        <!--<td class='rotate'><div> 세로형 텍스트 테스</div></td>-->
    <!--</tr>-->
    <!--<tr>-->
        <!--<td>-</td>-->
    <!--</tr>-->

<!--</table>-->


<div class="verical-field">
    a
</div>



<!--


<div ng-if="layout==='vertical'" ui-on-Drop="onDropAxisField($event, $data, $index)" class="drop-container"
     style="height:100%; min-height: 100px;>
    <div ng-if="!field"
         style="height: 100%">
        <div style="height: calc(100% - 0px); position: relative">
            <div style="position: absolute;top: 50%; left: 50%;
                                         -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                                        transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                                        text-overflow: ellipsis; white-space: nowrap">
                없음
            </div>
        </div>
    </div>
    <div ng-if="field"
         style="height: 100%"
         popup-layer-area="adv.axisField.setting_{{$index}}">
        <div>
            <button> ></button>
        </div>
        <div style="height: calc(100% - 50px);">
            <div style="position: absolute;top: 50%; left: 50%;
                                         -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                                        transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                                        text-overflow: ellipsis; white-space: nowrap">
                {{field.name}}
            </div>
        </div>
        <div>
            <button type="button" class="close" ng-click="clearAxisField($index)"></button>
        </div>
    </div>
</div>
-->





<div ng-if="layout!='vertical'" style="height: 100%" layer-offset="{left: 2}">
    <div class="mu-row">
        <div class="mu-col mu-col-1" ng-if="showLabel != 'false'" style="text-align: right; padding-right: 10px;">
            <span style="display: inline-block; margin-top: 6px">{{option.title}}</span>
        </div>
        <div class="mu-col mu-col-{{colWidth}}">
            <div ui-on-Drop="onDropField($event, $data, '{{field.key}}', {{index}})" class="drop-container"
                 layer-offset="{left: 2}">
                <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!field" style="">없음</span>
                <button style="position: absolute" ng-if="middle==='true'" type="button" class="close fr"
                        ng-click="deleteField(parentArray, index)"></button>
                <div class="field" ng-if="field">
                    <table style="width: 100%">
                        <tr>
                            <td style="width: 0">
                                <button ui-on-Drop="preventDrop($event)" type="button" class="close fl"
                                        ng-click="clearField($event, field, index)"></button>
                            </td>
                            <td style="display:block; width: 100%; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                {{field.name}}
                            </td>
                            <td style="width: 0">
                                <button ng-if="showPopup!='false' && position" class="fr"
                                        ng-click="openPopup($event, option.key+index, position)"> >
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <%@ include file="./dropFieldPopup.jsp"%>

        </div>

    </div>
</div>