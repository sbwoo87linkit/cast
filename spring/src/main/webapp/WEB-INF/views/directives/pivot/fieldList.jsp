<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!-- 필드 목록 -->
<table class="mu-formbox mu-slide-menu">
    <tbody>
        <tr ng-if="canChoiceCount">
            <th><spring:message code="event" /></th>
            <td>
                <ul>
                    <li>
                        <a href="" ng-click="clickItem(countField)">
                            <i class="mu-icon-img number"></i><span><spring:message code="pivot.num_event_object" /></span>
                        </a>
                    </li>
                </ul>
            </td>
        </tr>
        <tr ng-if="canChoiceTime">
            <th><spring:message code="time" /></th>
            <td>
                <ul>
                    <li>
                        <a href="" ng-click="clickItem(timeField)">
                            <i class="mu-icon-img time"></i><span ng-bind="timeField.name"></span>
                        </a>
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <th><spring:message code="field" /></th>
            <td>
                <ul>
                    <li ng-repeat="field in normalFields | filter:ignoreByNames">
                        <a href="" ng-click="clickItem(field)">
                            <i class="mu-icon-img" ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i><span ng-bind="field.name"></span>
                        </a>
                    </li>
                    <li ng-hide="(normalFields | filter:ignoreByNames).length">
                        <span><spring:message code="pivot.message.no_selectable_fields" /></span>
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
