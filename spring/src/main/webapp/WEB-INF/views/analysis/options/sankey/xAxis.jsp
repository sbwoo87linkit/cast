<div class="eqi-container">

    <div ng-repeat="field in adv.fieldOptions.drops.columnFields"
         ui-on-Drop="onDropColumnsField($event, $data, adv.fieldOptions.drops.columnFields, $index)" class="drop-container">
        <div class="field bx-none" ng-if="!field.name" style="">
            없음
            <button ng-if="$middle" type="button" class="close fr" ng-click="deleteField(adv.fieldOptions.drops.columnFields, $index)"></button>
        </div>
        <div class="field" ng-if="field.name">
            <button type="button" class="close fr" ng-click="clearField($event, 'columnFields', $index)"></button>
            <div>{{field.name}}</div>
        </div>
    </div>

</div>


<!--<table class="mu-formbox mu-formbox-vertical" style="height: 100%">-->
    <!--<colgroup>-->
        <!--<col width="50px">-->
    <!--</colgroup>-->
    <!--<tr>-->
        <!--<td>-->
        <!--</td>-->
        <!--<td>-->
            <!--<div class="eqi-container">-->

                <!--<div ng-repeat="field in adv.chartData"-->
                     <!--ui-on-Drop="onDropXAxisField($event, $data, $index)" class="drop-container">-->
                    <!--<div class="field bx-none" ng-if="!field.name" style="">-->
                        <!--없음-->
                        <!--<button ng-if="$middle" type="button" class="close fr" ng-click="deleteXAxisField($index)"></button>-->
                    <!--</div>-->
                    <!--<div class="field" ng-if="field.name">-->
                        <!--<button type="button" class="close fr" ng-click="removeXAxisField($index)"></button>-->
                        <!--<div>{{field.name}}</div>-->
                    <!--</div>-->
                <!--</div>-->

            <!--</div>-->
        <!--</td>-->
    <!--</tr>-->

<!--</table>-->
