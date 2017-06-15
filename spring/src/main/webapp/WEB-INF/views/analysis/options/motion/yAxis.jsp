<div ui-on-Drop="onDropField($event, $data,  fieldOpts, 'yAxisField', null)" class="drop-container" style="height: 100%" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!fieldOpts.drops.yAxisField"
          style="position: absolute; top: 50%; left: 3%;
          -webkit-transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          transform: translateX(-50%) translateY(-50%)  rotate(-90deg);
          text-overflow: ellipsis; white-space: nowrap">없음</span>
    <div class="field" ng-if="fieldOpts.drops.yAxisField" style="height: 100%">
        <div style="height: calc(100% - 20px);">
            <div ui-on-Drop="preventDrop($event)" style="position: absolute;top: 50%; left: 3%;
                 -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                 transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                 text-overflow: ellipsis; white-space: nowrap">
                {{fieldOpts.drops.yAxisField.name}}
            </div>
        </div>
        <div>
            <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, fieldOpts, 'yAxisField')"></button>
        </div>
    </div>
</div>