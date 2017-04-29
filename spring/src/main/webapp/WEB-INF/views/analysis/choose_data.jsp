<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-controller="analysis.ChooseDataCtrl" ng-init="aliasVar = {}">
    <div class="mu-container mu-scroll-h">
        <section>
            <div class="mu-row pivotHead">
                <div class="mu-col mu-col-12">
                    <div class="mu-hgroup fl">
                        <h3 class="mu-title"><spring:message code="analysis.choose_data" /></h3></div>
                    <!-- <div class="mu-hgroup fr">
                        <button type="button" class="mu-btn mu-btn-icon" ng-click="gotoPivot()" ng-disabled="!currDataName"><i class="mu-icon-img arrow-last"></i><span>다음</span></button>
                    </div> -->
                </div>
            </div>

            <div class="mu-row pivotBody">
                <div class="mu-col mu-col-12">

                    <div class="mu-panel">
                        <div class="mu-panel-head">

                            <div class="mu-hgroup">
                                <label><spring:message code="grid.filter" /></label>
                                <div class="mu-input-icon">
                                    <input type="text" class="mu-input" placeholder="search..." ng-model="modelText">
                                    <i class="mu-icon search"></i>
                                </div>
                                <span>{{modelList.length}} <spring:message code="grid.show_total_first" /> {{aliasVar.filteredList.length || 0}} <spring:message code="grid.show_total_last" /></span>
                            </div>
                            <!--페이지네이션 주석 처리-->
                            <!--<div class="mu-pagination fr">
                                <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img arrow-first"></i></button>
                                <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img arrow-prev"></i></button>
                                <ul>
                                    <li class="active"><a href="">1</a></li>
                                    <li><a href="">2</a></li>
                                    <li><a href="">3</a></li>
                                    <li><a href="">4</a></li>
                                    <li><a href="">5</a></li>
                                </ul>
                                <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img arrow-next"></i></button>
                                <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img arrow-last"></i></button>
                            </div>-->

                        </div>
                        <div class="mu-panel-body">

                            <div class="gridWrap">
                                <table class="mu-grid mu-grid-sort mu-grid-hover" mu-table="analysis.grid.choose_data" rows="modelList" filter="modelText" id="ade_tbl_models">
                                    <colgroup>
                                        <col width="48px">
                                        <col width="160px">
                                        <col width="">
                                        <col width="120px">
                                        <col width="120px">
                                        <col width="120px">
                                    </colgroup>
                                    <thead mu-table-head="" sortable="">
                                    <tr>
                                        <th class="none">#</th>
                                        <th data-field="name"><spring:message code="search.model_name" /></th>
                                        <th class="none"><spring:message code="field" /></th>
                                        <th data-field="table"><spring:message code="search.table_name" /></th>
                                        <th data-field="scope"><spring:message code="search.table_scope" /></th>
                                        <th data-field="partitionRange"><spring:message code="search.partition_range" /></th>
                                    </tr>
                                    </thead>
                                    <tbody mu-table-body="" selectable="mustone" selection-change="chooseData(row.id, row)">
                                    <tr ng-repeat="row in $data" ng-dblclick="dblclickModelRow($event, row)" ng-init="aliasVar.filteredList = $data">
                                        <td ng-bind="$index + 1"></td>
                                        <td>{{row.name}}</td>
                                        <td class="tl" style="word-break: break-word;">{{row.columns.join(', ')}}</td>
                                        <td>{{row.table}}</td>
                                        <td>{{row.scope}}</td>
                                        <td><span title="{{row.partitionRange | number}}">{{row.partitionRange | partitionRange}}</span></td>
                                    </tr>
                                    <tr ng-show="$data.length <= 0">
                                        <td colspan="{{$cols.length}}"><spring:message code="grid.no_data" /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>
</div>