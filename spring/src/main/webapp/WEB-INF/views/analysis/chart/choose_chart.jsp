<div class="mu-selectbox chart-chooser" mu-select="sb1" select-model="selModel"
     style="width:100%"
     select-items="selOptions" select-change="changeOption($model)">
    <button style="width: 100%" class="mu-value">
        <i class="mu-icon-20-img" ng-class="analysis.chart.icon"></i>
        {{analysis.chart.type}}
    </button>
    <ul class="mu-list">

        <div class="mu-row">
            <div class="mu-col mu-col-3" ng-repeat="group in chartGroups">
                {{group.name}}
                <hr>
                <div class="chart-change-cell" ng-repeat="chartItem in group.items"
                     ng-mouseenter="showDescription(chartItem)"
                     ng-mouseleave="hideDescription()"
                     ng-click="changeChart(chartItem)">
                    <i class="mu-icon-50-img" ng-class="chartItem.icon"></i>
                    <p>{{chartItem.type}}</p>
                </div>
            </div>
        </div>
        <div ng-if="analysis.tempChart" style="margin-top: 10px" class="tl">
            <p>설명</p>
            <hr>
            <div style="">
                {{analysis.tempChart.description}}
            </div>
        </div>
    </ul>
</div>
