<style>
    .mu-row.main {
        height: calc(100% - 50px);
    }

    .area-side {
        width: 20%;
        float: left;
        height: calc(100% - 0px);
        margin-right: 1px;
        /*padding: 30px;*/
        padding-top: 10px;
        border-right: 1px solid #d0d0d0;
        overflow-y: scroll;
    }

    .area-main {
        width: calc(80% - 1px);
        float: right;
        height: calc(100% - 0px);
        padding: 10px;
        overflow-y: scroll;
    }

    * {
        box-sizing: border-box;
    }

    h1 {
        height: auto;
    }

    .mu-tab {
        margin-top: 0px !important;
    }

</style>

<div class="area-side" style="position: relative">

    <div style="position: absolute; width: 100%; height:28px; border-bottom: 1px solid #ddd"></div>

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

            <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">20</span></h5>

            <ul class="mu-vMenu mu-slide-menu">
                <li ng-repeat="field in fieldList">
                    <a href="" ng-click="clickItem(field)">
                        <i class="mu-icon-img"
                           ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                        <span ng-bind="field.name"></span>
                    </a>
                </li>
            </ul>

        </div>
        <div class="mu-tabCont" mu-tab-contents="">
            <h4 class="mu-title tc">필터</h4>

            <ul class="mu-vMenu">
                <li class="active"><a href=""><i class="mu-icon ex"></i><span>Menu01</span></a></li>
                <li><a href=""><i class="mu-icon ex"></i><span>Menu02</span></a></li>

            </ul>
        </div>
    </div>


</div>

<div class="area-main">
    <!--main content-->

    <div class="header">
        <p class="txtGuide">current selected: {{selModel.type}}</p>

        <div class="mu-selectbox" mu-select="sb1" select-model="selModel" select-items="selOptions" select-change="changeOption($model)">
            <button class="mu-value"><i class="mu-icon-img data"></i>{{$model.type}}</button>
            <ul class="mu-list">
                <li ng-repeat="opt in $data" mu-option="" value="{{opt.type}}">{{opt.type}}</li>
            </ul>
        </div>

        <ul>
            <li ng-repeat="field in fields">
                <a href="" ng-click="clickItem(field)">{{$index}}_{{filed.name}}</a>
            </li>
            <li ng-hide="(normalFields | filter:ignoreByNames).length" class="ng-hide">
                <span>선택 가능한 필드가 없습니다.</span>
            </li>
        </ul>
    </div>

    <div class="blank" ng-if="!chartType">

    </div>

    <div class="chart-main" ng-if="chartType">


    </div>



</div>
