<div ui-on-Drop="onDropField($event, $data, 'timeField', null, 'TIMESTAMP')" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.timeField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.timeField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'timeField')"></button>
        <div>{{adv.fieldOptions.drops.timeField.name}}</div>
    </div>
</div>
