<div ui-on-Drop="onDropField($event, $data,  fieldOpts, 'groupField', null)" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.groupField" style="">없음</span>
    <div class="field" ng-if="fieldOpts.drops.groupField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, fieldOpts, 'groupField')"></button>
        <div>{{fieldOpts.drops.groupField.name}}</div>
    </div>
</div>
