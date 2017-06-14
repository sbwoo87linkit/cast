<div ui-on-Drop="onDropField($event, $data, 'groupField', null)" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.groupField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.groupField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'groupField')"></button>
        <div>{{adv.fieldOptions.drops.groupField.name}}</div>
    </div>
</div>
