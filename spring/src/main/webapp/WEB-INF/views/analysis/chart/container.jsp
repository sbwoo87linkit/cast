<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="analysis-container" ng-controller="analysis.chart.ContainerCtrl" id="ade_div_chart_cont">
    <div class="analysis-filter">
        <div style="position: absolute; width: 20%; height:28px; border-bottom: 1px solid #ddd"></div>
        <ul class="mu-tab" mu-tabset="ts2">
            <li mu-tab-item="" tab-activated="true">
                <a href="javascript:;">필드</a>
            </li>
            <li mu-tab-item="">
                <a href="javascript:;">필터</a>
            </li>
        </ul>
        <div class="mu-tab-body" mu-tabset="ts2">
            <div class="mu-tabCont" mu-tab-contents="">
                <!--side menu</p>-->
                <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">{{fieldList.length}}</span>
                </h5>
                <ul class="mu-slide-menu">
                    <li ng-repeat="field in fieldList">
                        <a href="" ng-click="clickItem(field)">
                            <i class="mu-icon-img"
                               ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                            <span ng-bind="field.name">aa {{field}}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="mu-tabCont" mu-tab-contents="">
                <h5 class="mu-title tc">필터</h5>
                필터 UI
            </div>
        </div>
    </div>
    <div class="analysis-chart">
        <div class="analysis-chart-header" style="padding: 5px">
            <div class="mu-selectbox" mu-select="sb1" select-model="selModel"
                 select-items="selOptions" select-change="changeOption($model)">
                <button style="width: 200px" class="mu-value">
                    <i class="mu-icon-20-img" ng-class="analysis.chart.icon"></i>
                    {{analysis.chart.type}}
                </button>
                <ul class="mu-list">

                    <div class="mu-row">
                        <div class="mu-col mu-col-3" ng-repeat="group in chartGroups">
                            {{group.name}}
                            <hr>
                            <div class="chart-change-cell" ng-repeat="chartItem in group.items"
                                 ng-model-options="{ debounce: 2000 }"
                                 ng-mouseenter="showDescription(chartItem)"
                                 ng-mouseleave="hideDescription()"
                                 ng-click="changeChart(chartItem)">
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
                </ul>
            </div>


        </div>
        <div class="analysis-chart-main">

            <!-- 차트유형 선택 않음 -->
            <div class="analysis-chart-none" ng-if="analysis.chart.icon === 'none'">
                <div class="center">
                    <span style="font-size:2.4em">차트 유형을 선택해 주세요.</span>
                </div>
            </div>

            <!--차트영역-->
            <div>


                <div class='wrapper'>
                    <div class='container' dragula='"first-bag"'>
                        <div>You can move these elements between these two containers</div>
                        <div>Moving them anywhere else isn't quite possible</div>
                        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
                    </div>
                    <div class='container' dragula='"first-bag"'>
                        <div>This is the default use case. You only need to specify the containers you want to use</div>
                        <div>More interactive use cases lie ahead</div>
                        <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on GitHub!</a></div>
                    </div>
                </div>



            </div>






        </div>
    </div>


</div>


