<div class="eqi-container">

    <div ng-repeat="field in fieldOpts.drops.columnFields"
         ui-on-Drop="onDropColumnsField($event, $data, fieldOpts, fieldOpts.drops.columnFields, $index)" class="drop-container">
        <div class="field bx-none" ng-if="!field.name" style="">
            없음
            <button ng-if="$middle" type="button" class="close fr" ng-click="deleteField(fieldOpts.drops.columnFields, $index)"></button>
        </div>
        <div class="field" ng-if="field.name">
            <button type="button" class="close fr" ng-click="clearField($event, fieldOpts, 'columnFields', $index)"></button>
            <div>{{field.name}}</div>
        </div>
    </div>

</div>
