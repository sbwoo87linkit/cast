<div ui-on-Drop="onDropField($event, $data,  fieldOpts, 'xAxisField', null)" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.xAxisField" style="">없음</span>
    <div class="field" ng-if="fieldOpts.drops.xAxisField">
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, fieldOpts, 'xAxisField')"></button>
        <div>{{fieldOpts.drops.xAxisField.name}}</div>
    </div>
</div>
