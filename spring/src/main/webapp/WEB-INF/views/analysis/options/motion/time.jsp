<div ui-on-Drop="onDropField($event, $data,  fieldOpts, 'timeField', null, 'TIMESTAMP')" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.timeField" style="">없음</span>
    <div class="field" ng-if="fieldOpts.drops.timeField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, fieldOpts, 'timeField')"></button>
        <div>{{fieldOpts.drops.timeField.name}}</div>
    </div>
</div>
