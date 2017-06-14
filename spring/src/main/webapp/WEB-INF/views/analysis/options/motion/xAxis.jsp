<div ui-on-Drop="onDropField($event, $data, 'xAxisField', null)" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.xAxisField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.xAxisField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'xAxisField')"></button>
        <div>{{adv.fieldOptions.drops.xAxisField.name}}</div>
    </div>
</div>
