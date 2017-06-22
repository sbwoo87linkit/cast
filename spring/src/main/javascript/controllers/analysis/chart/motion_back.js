'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var Highcharts = require('highcharts');
var async = require('async');

var html2canvas = require('html2canvas');
var canvg = require('canvg-fixed');

// var angular = require('angular');
// var d3 = require('d3');
// var webchart = require('webchart');


/**
 * Controller
 */

MotionCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function MotionCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                    searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window) {

    $scope.tabs = ['일반', 'X축', 'Y축', '원'];

    $scope.chartOpts = {

        general: {
            drilldown: {
                text: '드릴다운',
                controls: {
                    drilldown: {
                        type: 'buttonGroup',
                        selected: 'yes',
                        options: [
                            {text: "예", value: 'yes'},
                            {text: "아니오", value: 'no'}
                        ]
                    }
                }
            },
            keyValue: {
                text: '키 값',
                controls: {
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
        },
        xAxis: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'x Axis label' // 입력값 테스트
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            margin: {
                text: '간격',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            min: {
                text: '최소',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    input: {
                        type: 'input',
                        value: '1200'
                    }
                }
            },
            // sort: {
            //     text: '정렬',
            //     controls: {
            //         dropdown: {
            //             type: 'dropdown',
            //             selected: {}, // Dropdown 선택
            //             options: [
            //                 {text: "기본값", value: 'default'},
            //                 {text: "오름차순", value: 'ascending'},
            //                 {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
            //             ]
            //         }
            //     }
            // }
        },
        yAxis: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'y Axis label' // 입력값 테스트
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            margin: {
                text: '간격',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            min: {
                text: '최소',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    input: {
                        type: 'input',
                        value: '1200'
                    }
                }
            }
        },
        circle: {
            min: {
                text: '최소 크기',
                controls: {
                    input: {
                        type: 'input',
                        value: '1'
                    }
                }
            },
            max: {
                text: '최대 크기',
                controls: {
                    input: {
                        type: 'input',
                        value: '50'
                    }
                }
            },
        }

    }

    $scope.fieldOpts = {
        opts: {},
        drops: {
            sizeField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            // TODO: delete. 이하 테스트 Data
            timeField: _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            }),
            xAxisField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            yAxisField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            groupField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
        }

    }

    var _modelChangeTimer = null;

    $scope.$watch('chartOpts', function (value) {

        console.log('Model Changed....111')
        // if data is not loaded
        if (!$scope.data) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            console.log('Model Changed....')
            renderChart()

        }, 100);
    }, true);

    /**
     *   button group
     */

    var chart;

    $scope.currState = 'stop';
    $scope.isState = function (state) {
        return $scope.currState === state;
    };

    $scope.play = function () {
        $scope.currState = 'play';
        chart.play();
    };
    $scope.pause = function () {
        $scope.currState = 'pause';
        chart.pause();
    };
    $scope.resume = function () {
        $scope.currState = 'resume';
        chart.resume();
    };
    $scope.stop = function () {
        $scope.currState = 'stop';
        chart.stop();
    };

    window.onresize = function () {
        resizeAll();
    };

    function resizeAll() {
        $('.chart').each(function () {
            $(this).highcharts().setSize(
                $(this).parent().width(),
                $(this).parent().height(),
                false
            );
        });
        _.forEach($scope.adv.chartData, function (row, index) {
            var container = $('#container_' + index);
            if (row.config) {
                var chart = row.config.getChartObj();
                $timeout(function () {
                    chart.setSize(container.width(), container.height(), true);
                })
            }
        })
    }

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {
        var msg = null;

        if (!$scope.fieldOpts.drops.groupField) {
            msg = '그룹 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.sizeField) {
            msg = '사이즈 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.yAxisField) {
            msg = 'y축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.xAxisField) {
            msg = 'x축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.timeField) {
            msg = '시간 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }


        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts
        }

        utility.closeAllLayers();

        var service = 'adv-motion';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                // console.log(d1);
                $scope.adv.isWaiting = false;
                $scope.data = d.data;
                renderChart(service, d);
            }, function (err) {
            });
        });

    })

    var renderChart = function (service, d, rowIndex) {

        console.log($scope.chartOpts.circle.max.controls.input.value)

        // $('.motion-slider').remove();
        $('#chart1').empty();

        var MotionChart = MobigenWebChart.chart.MotionChart;

        var options = {
            width: 600,
            height: 400,
            xAxis: {
                map: 'AB',
                // ticks: 7,
                // tickValues: [1, 2, 3, 5, 8, 13, 21],
                label: $scope.chartOpts.xAxis.label.controls.checkbox.value ? $scope.chartOpts.xAxis.label.controls.input.value : '',
                grid: true
            },
            yAxis: {
                map: 'H',
                label: $scope.chartOpts.yAxis.label.controls.checkbox.value ? $scope.chartOpts.yAxis.label.controls.input.value : '',
                grid: true
            },
            radius: {
                map: 'HR',
                range: [
                    $scope.chartOpts.circle.min.controls.input.value,
                    $scope.chartOpts.circle.max.controls.input.value
                ] // [min, max]
            },
            series: {
                map: 'PTIME'
            },
            key: 'PLAYERID',
            slider: {
                tickFormat: '%Y'
                // tickFormat: '%Y%m%d%H%M%S'
            },
            lostData: {
                type: 'blur'
            }
        };
        chart = new MotionChart('#chart1', options);

        chart.duration(10000); // 10 sec


        // var data = d.data.results;
        var data = $scope.data.results;

        var parseDate = d3.time.format('%Y').parse;
        // var parseDate = d3.time.format('%Y%m%d%H%M%S').parse;
        var data = [];
        $scope.data.results.forEach(function (item, i) {
            // var arr = [];
            var obj = {};
            $scope.data.fields.forEach(function (field, j) {
                // data.push({})
                // arr.push()
                if (field.type === 'TIMESTAMP') {
                    // obj[field.name] = parseDate(utility.strToDate(item[j]));
                    obj[field.name] = parseDate(item[j].substring(0, 4));
                } else {
                    obj[field.name] = item[j];
                }
            })
            data.push(obj)
        })

        data = [
            {"PTIME": "1974", "AB": 367, "H": 211, "PLAYERID": "Sanches", "HR": 10},
            {"PTIME": "1975", "AB": 267, "H": 123, "PLAYERID": "Ruis", "HR": 20},
            {"PTIME": "1976", "AB": 1367, "H": 1112, "PLAYERID": "Piazza", "HR": 98},
            {"PTIME": "1977", "AB": 467, "H": 216, "PLAYERID": "Sanches", "HR": 15},
            {"PTIME": "1978", "AB": 667, "H": 323, "PLAYERID": "Ruis", "HR": 40},
            {"PTIME": "1979", "AB": 267, "H": 112, "PLAYERID": "Piazza", "HR": 9},
            {"PTIME": "1980", "AB": 867, "H": 412, "PLAYERID": "Sanches", "HR": 30},
            {"PTIME": "1981", "AB": 578, "H": 358, "PLAYERID": "Ruis", "HR": 60},
            {"PTIME": "1982", "AB": 1157, "H": 1002, "PLAYERID": "Piazza", "HR": 140}
        ]

        data.forEach(function (d) {
            d.AB = +d.AB;
            d.H = +d.H;
            d.HR = +d.HR;
            d.PTIME = parseDate(d.PTIME);
        });

        // chart
        //     .data(data)
        //     .draw();

        console.log('draw....   ')

        chart.data(data)
            .xDomain([
                $scope.chartOpts.xAxis.min.controls.input.value,
                $scope.chartOpts.xAxis.max.controls.input.value])
            .yDomain([
                $scope.chartOpts.yAxis.min.controls.input.value,
                $scope.chartOpts.yAxis.max.controls.input.value])
            .draw();
    };


    $scope.exportHtml = function () {
        console.log('exportHtml....')
        var finalImageSrc, img;
        canvg();
        html2canvas([$('div.visualization')[0]], {
            useCORS: true,
            background:'#fff'
        }).then(function (canvas) {
            if (navigator.msSaveBlob) {
                console.log('this is IE');
                var URL=window.URL;
                var BlobBuilder = window.MSBlobBuilder;
                navigator.saveBlob=navigator.msSaveBlob;
                var imgBlob = canvas.msToBlob();
                if (BlobBuilder && navigator.saveBlob) {
                    var showSave =  function (data, name, mimetype) {
                        var builder = new BlobBuilder();
                        builder.append(data);
                        var blob = builder.getBlob(mimetype||"application/octet-stream");
                        if (!name)
                            name = "Download.bin";
                        navigator.saveBlob(blob, name);
                    };
                    showSave(imgBlob, 'barchart.png',"image/png");
                }
            } else {
                if ($('#export-image-container').length == 0)
                    $('body').append('<a id="export-image-container" download="barchart.jpg">')
                img = canvas.toDataURL("image/jpeg")
                img = img.replace('data:image/jpeg;base64,', '')
                finalImageSrc = 'data:image/jpeg;base64,' + img

                $('#export-image-container').attr('href', finalImageSrc)
                $('#export-image-container')[0].click()
                $('#export-image-container').remove()
            }
        });

    }


    $scope.exportSvg = function () {


        if (!$scope.data) {
            popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
            });
            return false;
        }

        // NOTE : http://techslides.com/save-svg-as-an-image 참조
        var html = d3.select("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        html = html.substring(0, html.lastIndexOf('<div'));
        // console.log('html', html);

        var encoded = btoa(unescape(encodeURIComponent(html)));
        var imgsrc = 'data:image/svg+xml;base64,' + encoded;
        var img = '<img src="' + imgsrc + '">';
        d3.select("#svgdataurl").html(img);

        var canvas = document.createElement('canvas'),
            context = canvas.getContext("2d");
        canvas.width = parseInt(d3.select("svg").style('width'));
        canvas.height = parseInt(d3.select("svg").style('height'));
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var image = new Image;
        image.src = imgsrc;
        image.onload = function () {
            context.drawImage(image, 0, 0);
            var canvasdata = canvas.toDataURL("image/png");
            var pngimg = '<img src="' + canvasdata + '">';
            d3.select("#pngdataurl").html(pngimg);

            var a = document.createElement("a");
            a.download = "chart.png";
            a.href = canvasdata;

            a.click();
        };
    }

    // screenshot 생성
    $scope.screenshot = function() {
        // 임시 컨테이너 생성
        var tempContainer = $('<div />', {
            id: 'temp-container',
            'class': 'temp-container'
        }).appendTo('body');

        var checkedVals = [];
        $('.HSbubble_nat_ipt').find('input[type="checkbox"]').each(function() {
            checkedVals.push($(this)[0].checked);
        });

        // 원본 컨테이너 내용 복사
        var clone = $('#container').clone();
        clone.find('.not-print').remove();      // 인쇄 및 저장하지 않을 element 를 제거
        var content = $('<div />').append(clone).html();

        // 원본 컨테이너를 body 에서 떼어서 보관함
        var container = $('#container').detach();

        // 임시 컨테이너에 원본 컨테이너의 내용을 넣음
        tempContainer.html(content);

        $('.HSbubble_nat_ipt').find('input[type="checkbox"]').each(function(i) {
            if (checkedVals[i]) {
                $(this)[0].checked = true;
            } else {
                $(this)[0].checked = false;
            }
        });

        tempContainer.find('.tab-container').hide();
        tempContainer.find('.HSworld_map_select').find('.handle').removeClass('down').addClass('up');

        // 페이지의 svg 를 canvas 로 변환
        canvg();    // canvg 를 실행하지 않아도 html2canvas 로 화면캡쳐가 가능하나, highcharts 의 x,y 축 labeㅣ 등이 잘 표시되지 않는 현상이 있어서 canvg 를 실행함

        // 페이지를 canvas 로 변환
        html2canvas(document.body, {
            onrendered: function(canvas) {
                var dataUri = canvas.toDataURL('image/png'),
                    // var dataUri = canvas.toDataURL('image/jpeg',1),
                    dataUri = dataUri.split(',')[1];    // "data:image/png;base64" 삭제

                // 페이지를 변환한 canvas 를 dataUri 로 변환하여 png 파일 생성
                // $('#export-filename').val('export.jpg');
                $('#export-filename').val('export.png');
                $('#export-data').val(dataUri);
                $('#export-form').submit();

                // 임시 컨테이너 삭제
                $('#temp-container').remove();

                // 원본 컨테이너를 body 에 다시 넣음
                $('body').append(container);
            }
        });
    };


}

module.exports = MotionCtrl;
