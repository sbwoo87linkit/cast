<style>
    .header {
        height:30px;
        background: deepskyblue;
    }
    .main-container {
        height: calc(100% - 30px);
        background: #e5e5e5;
        padding:30px;
    }
    .blank {

        height: 100%;

        background: pink;
        border: 3px dotted #9d9d9d;
    }
    .chart-main {
        /*position: absolute;*/
        height: 100%;
        width:100%;
        background: deepskyblue;
    }
    .main-overlay {
        height: 100%;
        background: blue;
    }
    .chart-change-cell {
        height:70px;
        margin:5px;
        padding: 5px;
        border: 5px solid transparent;
        background: powderblue;
    }
    .chart-change-cell:hover {
        cursor: pointer;
        border: 5px solid deeppink;
    }
</style>
<!--<div class="header">-->
    <!--<p class="txtGuide">current selected: {{chart}}</p>-->
    <!--<div class="mu-selectbox" mu-select="sb1" select-model="chart" select-items="selOptions" select-change="changeOption($model)">-->
        <!--<button class="mu-value"><i class="mu-icon-img data"></i>{{$model.type}}</button>-->
        <!--<ul class="mu-list">-->
            <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.type}}">{{opt.type}}</li>-->
        <!--</ul>-->
    <!--</div>-->
<!--</div>-->


<div class="header">
    <!--<p class="txtGuide">current selected: {{chart}}</p>-->
    <!--<div class="mu-selectbox" mu-select="sb1" select-model="chart" select-items="selOptions" select-change="changeOption($model)">-->
        <!--<button class="mu-value"><i class="mu-icon-img data"></i>{{$model.type}}</button>-->
        <!--<ul class="mu-list">-->
            <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.type}}">{{opt.type}}</li>-->
        <!--</ul>-->
    <!--</div>-->
    <!-- popup target -->
    <!--<button type="button" class="mu-btn mu-btn-icon" mu-tooltip-area="tt1"><i class="mu-icon info"></i>default tooltip</button>-->





    <!--<button type="button" class="mu-btn mu-btn-icon" mu-tooltip-area="tt1" tooltip-placement="bottom" tooltip-trigger="click"><i class="mu-icon info"></i>click popup</button>-->
    <!--<div class="mu-tooltip" mu-tooltip="tt1">-->
        <!--<div class="arrow"></div>-->
        <!--<div class="mu-tooltip-inner">-->
            <!--<span>Hello, World!!aaaaaa</span>-->
        <!--</div>-->
    <!--</div>-->

    <!--<div class="mu-tooltip" style="">-->
        <!--&lt;!&ndash;<button class="mu-btn btnApply fr" type="button" ng-click="changeQuery(inputQuery)">저장</button>&ndash;&gt;-->
        <!--<button type="button" class="mu-btn mu-btn btnApply" popup-layer-area="analysis.chart.select" layer-offset="{left: 0, top: 2}" layer-open="openedTimeLayer()" layer-close="closedTimeLayer()">-->
            <!--<i class="mu-icon-img date"></i><span>최근 1 주</span>-->
        <!--</button>-->
    <!--</div>-->

    <!--<button class="mu-value">-->
        <!--<i class="mu-icon-img data" popup-layer-area="analysis.chart.select" layer-offset="{left: 0}"  layer-open="openedTimeLayer()" layer-close="closedTimeLayer()"></i>AAAAAAA{{$model.type}}</button>-->

    <button type="button" class="mu-btn mu-btn active" popup-layer-area="analysis.chart.change" layer-offset="{left: 0, top: 0}" layer-open="openedTimeLayer()" layer-close="closedTimeLayer()">
        <i class="mu-icon-img date"></i><span>{{analysis.chart.type}}</span>
    </button>



    <div class="mu-tooltip bottom-left" style="width: 745px; display: block; margin-top: 0" popup-layer="analysis.chart.change">
        <!--library에서 arrow를 참조하므로 template 유지-->
        <div class="arrow" style="left: 16px; display: none"></div>
        <div class="mu-tooltip-inner changeChart">
            <div class="mu-row">
                <div class="mu-col mu-col-3" ng-repeat="group in chartGroups">
                    {{group.name}}
                    <hr>
                    <div class="chart-change-cell" ng-repeat="chartItem in group.items"
                    "ng-model-options"="{ debounce: 2000 }"
                         ng-mouseenter="showDescription(chartItem)"
                         ng-mouseleave="hideDescription()"
                         ng-click="changeChart(chartItem)">
                        <p>{{chartItem.icon}}</p>
                        {{chartItem.type}}
                    </div>
                </div>
            </div>

            <div ng-if="analysis.tempChart" style="margin-top: 10px">
                <p>설명</p>
                <hr>
                <div style="">
                    <h1 class="tl">{{analysis.tempChart.type}}</h1>
                    {{analysis.tempChart.description}}
                </div>
            </div>


        </div>
    </div>














</div>
<div class="main-container">
    <div class="blank" ng-if="chart.type">
        블랭크영역
    </div>

    <div class="chart-main" ng-if="!chart.type">
        차트영역
    </div>
</div>

