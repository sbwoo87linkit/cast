<div class="header">
    <button type="button" class="mu-btn tl" style="min-width: 200px" popup-layer-area="analysis.chart.change" layer-offset="{left: 0, top: 0}" layer-open="openedTimeLayer()" layer-close="closedTimeLayer()">
        <i class="mu-icon-20-img" ng-class="analysis.chart.icon"></i>
        <span style="display: inline-block">{{analysis.chart.type}}</span>
    </button>

    <div class="mu-tooltip bottom-left" style="width: 745px; display: block; margin-top: 0" popup-layer="analysis.chart.change">
        <!--library에서 arrow를 참조하므로 template 유지-->
        <div class="arrow" style="left: 16px; display: none"></div>
        <div class="mu-tooltip-inner changeChart">
            <div class="mu-row">
                <div class="mu-col mu-col-3" ng-repeat="group in chartGroups">
                    {{group.name}}
                    <hr>
                    <div class="chart-change-cell" ng-repeat="chartItem in group.items" ng-model-options="{ debounce: 2000 }"
                         ng-mouseenter="showDescription(chartItem)"
                         ng-mouseleave="hideDescription()"
                         ng-click="changeChart(chartItem)">
                    <!--<img ng-src="/resources/images/chart/{{chartItem.icon}}" alt=""-->
                         <!--style="width: 70px; height: 70px;">-->
                        <!--<i class="mu-icon-100-img" ng-class="{ line: 'line', pie: 'pie', motion: 'motion' }[chartItem.icon]"></i>-->
                        <i class="mu-icon-100-img" ng-class="chartItem.icon"></i>
                    <p>{{chartItem.type}}</p>
                    </div>
                </div>
            </div>

            <div ng-if="analysis.tempChart" style="margin-top: 10px">
                <p>설명</p>
                <hr>
                <div style="">
                    {{analysis.tempChart.description}}
                </div>
            </div>
        </div>
    </div>
</div>

<div class="main-container">
    <div id="container" ng-if="analysis.chart.type==='차트 유형 선택'" style="height: 100%; width: 100%;">
        <div id="content">
            <span style="font-size: 2.4em">차트 유형을 선택해 주세요.</span>
        </div>
    </div>
</div>

