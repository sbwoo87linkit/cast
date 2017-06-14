<div ui-on-Drop="onDropField($event, $data, 'sizeField', null)" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.sizeField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.sizeField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'sizeField')"></button>
        <div>{{adv.fieldOptions.drops.sizeField.name}}</div>
    </div>
</div>
