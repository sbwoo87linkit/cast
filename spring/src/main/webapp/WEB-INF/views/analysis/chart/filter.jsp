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
        <ul class="mu-slide-menu" id="containerLeft" class='containerVertical'>
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
        <h5 class="mu-title tc">필터</h5>
        필터 UI
    </div>
</div>
