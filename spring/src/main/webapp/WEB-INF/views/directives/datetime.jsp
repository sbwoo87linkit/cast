<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<ul class="mu-slide-menu" mu-accordion="ac1" only-one="">
    <li class="active" mu-accordion-item="" is-expanded="true"><!-- 활성화시 active추가 -->
        <a href="" mu-accordion-head=""><spring:message code="datetime_picker.presets" /></a>
        <div class="mu-slide-body" mu-accordion-body="">
            <ul>
                <li ng-click="applyInit()"><a href=""><spring:message code="datetime_picker.all_time" /></a></li>
            </ul>
            <ul>
                <li ng-click="applyPreset('today')"><a href=""><spring:message code="datetime_picker.today" /></a></li>
                <li ng-click="applyPreset('yesterday')"><a href=""><spring:message code="datetime_picker.yesterday" /></a></li>
                <li ng-click="applyPreset('this_week')"><a href=""><spring:message code="datetime_picker.this_week" /></a></li>
                <li ng-click="applyPreset('prev_week')"><a href=""><spring:message code="datetime_picker.prev_week" /></a></li>
                <li ng-click="applyPreset('this_month')"><a href=""><spring:message code="datetime_picker.this_month" /></a></li>
                <li ng-click="applyPreset('prev_month')"><a href=""><spring:message code="datetime_picker.prev_month" /></a></li>
                <li ng-click="applyPreset('this_quarter')"><a href=""><spring:message code="datetime_picker.this_quarter" /></a></li>
                <li ng-click="applyPreset('prev_quarter')"><a href=""><spring:message code="datetime_picker.prev_quarter" /></a></li>
                <li ng-click="applyPreset('this_year')"><a href=""><spring:message code="datetime_picker.this_year" /></a></li>
                <li ng-click="applyPreset('prev_year')"><a href=""><spring:message code="datetime_picker.prev_year" /></a></li>
            </ul>
            <ul>
                <li ng-click="applyPreset('-15m')"><a href=""><spring:message code="datetime_picker.last_15_minutes" /></a></li>
                <li ng-click="applyPreset('-60m')"><a href=""><spring:message code="datetime_picker.last_60_minutes" /></a></li>
                <li ng-click="applyPreset('-4h')"><a href=""><spring:message code="datetime_picker.last_4_hours" /></a></li>
                <li ng-click="applyPreset('-24h')"><a href=""><spring:message code="datetime_picker.last_24_hours" /></a></li>
                <li ng-click="applyPreset('-7d')"><a href=""><spring:message code="datetime_picker.last_7_days" /></a></li>
                <li ng-click="applyPreset('-2w')"><a href=""><spring:message code="datetime_picker.last_2_weeks" /></a></li>
                <li ng-click="applyPreset('-3w')"><a href=""><spring:message code="datetime_picker.last_3_weeks" /></a></li>
                <li ng-click="applyPreset('-4w')"><a href=""><spring:message code="datetime_picker.last_4_weeks" /></a></li>
            </ul>
        </div>
    </li>
    <li class="" mu-accordion-item=""><!-- 활성화시 active추가 -->
        <a href="" mu-accordion-head=""><spring:message code="datetime_picker.relative" /></a>
        <div class="mu-slide-body" mu-accordion-body="">
            <div><i class="mu-icon-img alert" ng-show="isRelError"></i><span ng-bind="relErrMsg"></span></div>
            <div class="mu-search-item timeRelative">
                <label><spring:message code="time_range.start" />: </label>
                <div class="mu-item-group">
                    <label>
                        <!-- <i class="mu-icon clock"></i> -->
                    </label>
                    <input type="text" class="mu-input" ng-model="relval.start">
                    <div class="mu-selectbox" mu-select="datetime.relstart" select-model="relStart" select-items="relStartOptions">
                        <button class="mu-value">{{$model.text}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                        </ul>
                    </div>
                    <div class="timeView" ng-bind="choosedDate(relval.start, relStart.value)"></div>
                </div>
                <label> ~ </label>
                <label><spring:message code="time_range.end" />: </label>
                <div class="mu-item-group">
                    <label>
                        <!-- <i class="mu-icon clock"></i> -->
                    </label>
                    <input type="text" class="mu-input" ng-model="relval.end" ng-disabled="isNowInSelect" ng-readonly="isNowInSelect">
                    <div class="mu-selectbox" mu-select="datetime.relend" select-model="relEnd" select-items="relEndOptions" select-change="changeRelEnd($model)">
                        <button class="mu-value">{{$model.text}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                        </ul>
                    </div>
                    <div class="timeView" ng-bind="choosedDate(relval.end, relEnd.value)"></div>
                </div>
                <div class="mu-hgroup fr">
                    <!-- <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img default"></i><span>기본값</span></button> -->
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="applyRelative()"><i class="mu-icon-img apply"></i><span><spring:message code="apply" /></span></button>
                </div>
            </div>
        </div>
    </li>
    <li class="" mu-accordion-item=""><!-- 활성화시 active추가 -->
        <a href="" mu-accordion-head=""><spring:message code="datetime_picker.datetime_range" /></a>
        <div class="mu-slide-body" mu-accordion-body="">
            <div><i class="mu-icon-img alert" ng-show="isDateError"></i><span ng-bind="dateErrMsg"></span></div>
            <div class="mu-search-item">
                <div class="mu-item-group">
                    <div class="mu-selectbox" mu-select="datetime.rangesel" select-model="rangeDate" select-items="rangeOptions">
                        <button class="mu-value">{{$model.text}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                        </ul>
                    </div>
                </div>
                <div class="mu-item-group" ng-show="rangeDate.value === 'between' || rangeDate.value === 'after'">
                    <!-- <label><spring:message code="time_range.start" />: </label> -->
                    <div class="mu-datepicker">
                        <input type="text" ng-model="datetime.startDate" mu-datepicker="datetime.startdate" date-change="changeDt(datetime.startDate)" datepicker-options="settings" />
                        <button class="mu-btn mu-btn-icon mu-btn-icon-only" mu-datepicker-toggle="datetime.startdate"><i class="mu-icon calendar"></i></button>
                    </div>
                </div>
                <div class="mu-item-group" ng-show="rangeDate.value === 'between' || rangeDate.value === 'after'">
                    <time-picker time-model="datetime.startTime"></time-picker>
                </div>
                <label ng-show="rangeDate.value === 'between'"> ~ </label>
                <div class="mu-item-group" ng-show="rangeDate.value === 'between' || rangeDate.value === 'before'">
                    <!-- <label><spring:message code="time_range.end" />: </label> -->
                    <div class="mu-datepicker">
                        <input type="text" ng-model="datetime.endDate" mu-datepicker="datetime.enddate" date-change="changeDt(datetime.endDate)" datepicker-options="settings" />
                        <button class="mu-btn mu-btn-icon mu-btn-icon-only" mu-datepicker-toggle="datetime.enddate"><i class="mu-icon calendar"></i></button>
                    </div>
                </div>
                <div class="mu-item-group" ng-show="rangeDate.value === 'between' || rangeDate.value === 'before'">
                    <time-picker time-model="datetime.endTime"></time-picker>
                </div>
                <div class="mu-hgroup fr">
                    <!-- <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img default"></i><span>기본값</span></button> -->
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="applyCustom()"><i class="mu-icon-img apply"></i><span><spring:message code="apply" /></span></button>
                </div>
            </div>
        </div>
    </li>
</ul>
