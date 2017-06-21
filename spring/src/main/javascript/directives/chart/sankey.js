'use strict';
/**
*
*/
var d3 = require('d3');
d3.sankey = require('d3-sankey').sankey;
d3.sankeyLinkHorizontal = require('d3-sankey').sankeyLinkHorizontal;
/**
*
*/
Sankey.$inject = ['$window', 'DEFAULT'];
function Sankey($window, DEFAULT) {
    /**
    *   directive link
    */
    function link(scope, element) {
        /**
        *
        */
        var _resizeTimer = null;
        /**
        *
        */
        var parentEl = element.parent();
        var width = parentEl.width();
        var height = parentEl.height();
        // height = height - 30;

        var svg = d3.select(element.find('svg')[0])
            .attr('width', width)
            .attr('height', height);

        var valueFormatter = d3.format(',.0f');
        var color = d3.scale.category20();

        var sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 1], [width - 1, height - 6]]);

        var linkGroup = svg.append('g')
            .attr('class', 'links')
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-opacity', 0.2);

        var nodeGroup = svg.append('g')
            .attr('class', 'nodes')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10);
        /**
        *
        */
        scope.$watch('options', function (options) {
            if (!options) {
                return;
            }
            setOptions(options);
        }, true);
        scope.$watch('data', function (data) {
            if (!data) {
                return;
            }
            render(data);
        });

        $($window).on('resize', onResizeWindow);
        scope.$on('$destroy', function () {
            $($window).off('resize', onResizeWindow);
        });
        // 차트 사이즈 변경 처리
        function resizeAll() {
            width = parentEl.width();
            height = parentEl.height();

            svg
                .attr('width', width)
                .attr('height', height);

            // sankey
            //     .extent([[1, 1], [width - 1, height - 6]]);
            setOptions();

            render(scope.data);

        }
        function onResizeWindow() {
            if (!scope.data) {
                return;
            }
            $window.clearTimeout(_resizeTimer);
            _resizeTimer = $window.setTimeout(resizeAll, DEFAULT.RESIZE_INTERVAL);
        }
        /**
        *   functions
        */
        function setOptions(options) {

            d3.selectAll('.labels').remove();
            if (scope.options.columnLabelShow) {

                svg
                    .append('g')
                    .attr('class', 'labels')
                    .append('text')
                    .attr('x', (width / 2))
                    .attr('y', height - 6)
                    .attr('text-anchor', 'middle')  // start, middle, end
                    .style('font-size', '16px')
                    // .style('text-decoration', 'underline')
                    .text(scope.options.columnLabelText);

                sankey
                    .extent([[1, 1], [width - 1, height - 6 - 16]]);

            } else {
                sankey
                    .extent([[1, 1], [width - 1, height - 6]]);
            }

        }

        // function clean() {
        //     svg.select('g.nodes').selectAll('*').remove();
        //     svg.select('g.links').selectAll('*').remove();
        // }
        function render(data) {
            sankey(data);

            // 링크 추가/갱신/삭제
            var links = linkGroup.selectAll('path').data(data.links);
            var link = links.enter().append('path')
                .attr('class', 'link');
            link.append('title');

            links.attr('d', d3.sankeyLinkHorizontal())
                .attr('stroke-width', function(d) { return Math.max(1, d.width); })
              .select('title')
                .text(function(d) { return d.source.name + ' → ' + d.target.name + '\n' + valueFormatter(d.value); });

            links.exit().remove();

            // 노드 추가/갱신/삭제
            var nodes = nodeGroup.selectAll('g').data(data.nodes);
            var node = nodes.enter().append('g')
                .attr('class', 'node');
            node.append('rect');
            node.append('text');
            node.append('title');

            nodes.select('rect')
                .attr('x', function(d) { return d.x0; })
                .attr('y', function(d) { return d.y0; })
                .attr('height', function(d) { return d.y1 - d.y0; })
                .attr('width', function(d) { return d.x1 - d.x0; })
                .attr('fill', function(d) { return color(d.name.replace(/ .*/, '')); })
                .attr('stroke', '#000');

            nodes.select('text')
                .attr('x', function(d) { return d.x0 - 6; })
                .attr('y', function(d) { return (d.y1 + d.y0) / 2; })
                .attr('dy', '0.35em')
                .attr('text-anchor', 'end')
                // .text(function(d) { return d.name; })
                .text(function(d) {
                    console.log(d)
                    if (scope.options.dataLabelShow==='on') {
                        return d.name + ' : ' + valueFormatter(d.value);
                        // console.log('TEXT....')
                        // return d.name + '>>> aaa';
                    } else {
                        return d.name;
                    }
                })
              .filter(function(d) { return d.x0 < width / 2; })
                .attr('x', function(d) { return d.x1 + 6; })
                .attr('text-anchor', 'start');

            nodes.select('title')
                .text(function(d) { return d.name + '\n' + valueFormatter(d.value); });

            nodes.exit().remove();
        }
    }

    return {
        restrict: 'E',
        replace: false,
        template: '<svg></svg>',
        scope: {
            options: '=?',
            data: '=?'
        },
        link: link
    };
}

module.exports = Sankey;
