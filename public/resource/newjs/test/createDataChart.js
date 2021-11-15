$(document).ready(function(){

    Chart.pluginService.register({
        beforeRender: function (chart) {
            if (chart.config.options.showAllTooltips) {
                // create an array of tooltips
                // we can't use the chart tooltip because there is only one tooltip per chart
                chart.pluginTooltips = [];
                chart.config.data.datasets.forEach(function (dataset, i) {
                    chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                        chart.pluginTooltips.push(new Chart.Tooltip({
                            _chart: chart.chart,
                            _chartInstance: chart,
                            _data: chart.data,
                            _options: chart.options.tooltips,
                            _active: [sector]
                        }, chart));
                    });
                });

                // turn off normal tooltips
                chart.options.tooltips.enabled = false;
            }
        },
        afterDraw: function (chart, easing) {
            if (chart.config.options.showAllTooltips) {
                // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                if (!chart.allTooltipsOnce) {
                    if (easing !== 1)
                        return;
                    chart.allTooltipsOnce = true;
                }

                // turn on tooltips
                chart.options.tooltips.enabled = true;
                Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                    tooltip.initialize();
                    tooltip.update();
                    // we don't actually need this since we are not animating tooltips
                    tooltip.pivot();
                    tooltip.transition(easing).draw();
                });
                chart.options.tooltips.enabled = false;
            }
        }
    });
    chartLoad1();
    chartLoad2();
    chartLoad3();
});


function chartLoad1(){
    var ctx = document.getElementById("testChart").getContext("2d");
    var dataTime = ['intent','완료','상담사','포기'];
    var graphData = [180,900,800,400];

    var data = {
        labels: dataTime,
        datasets: [
            {
                data: graphData,
                backgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ],
                hoverBackgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ]
            }]
    };
    var myPieChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: {
            showAllTooltips: true,
            scales: {
                xAxes: [{
                    ticks: {
                         min: 0,
                         max: 1200,
                         stepSize : 200
                     },
                     scaleLabel: {
                      display: true,
                      fontFamily :'Nanum Barun Gothic',
                      labelString: '(건)',
                    }
                }],
                yAxes: [{
                    categoryPercentage: 1.0,
                    barPercentage: 0.5,
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
 				mode: 'point',
 				titleFontSize: 16,
                titleFontStyle: 'bold',
                titleFontColor: '#333',
                titleMarginBottom:0,
 				titleFontFamily: 'Nanum Barun Gothic',
 				titleMarginBottom: 2,
                titleMarginLeft: 10,
 				backgroundColor: 'rgb(0,0,0,0)',
 				xPadding: 10,
 				yAlign:20,
 				xAlign:20,
 				callbacks: {
 					title: function(tooltipItem){
 						return '' + tooltipItem[0].xLabel;
 					},
 					label: function(tooltipItem, data){
 						return false;
 					},
 				},
 			},
        }
    });

}
function chartLoad2(){
    var ctx = document.getElementById("test2Chart").getContext("2d");
    var dataTime = ['상담사','건수'];
    var graphData = [180,800];

    var data = {
        labels: dataTime,
        datasets: [
            {
                data: graphData,
                backgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ],
                hoverBackgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ]
            }]
    };
    var myPieChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: {
            showAllTooltips: true,
            scales: {
                xAxes: [{
                    ticks: {
                         min: 0,
                         max: 1200,
                         stepSize : 200
                     },
                     scaleLabel: {
                      display: true,
                      fontFamily :'Nanum Barun Gothic',
                      labelString: '(건)',
                    }
                }],
                yAxes: [{
                    categoryPercentage: 0.7,
                    barPercentage: 0.5,
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
 				mode: 'point',
 				titleFontSize: 16,
                titleFontStyle: 'bold',
                titleFontColor: '#333',
                titleMarginBottom:0,
 				titleFontFamily: 'Nanum Barun Gothic',
 				titleMarginBottom: 2,
                titleMarginLeft: 10,
 				backgroundColor: 'rgb(0,0,0,0)',
 				xPadding: 10,
 				yAlign:20,
 				xAlign:20,
 				callbacks: {
 					title: function(tooltipItem){
 						return '' + tooltipItem[0].xLabel;
 					},
 					label: function(tooltipItem, data){
 						return false;
 					},
 				},
 			},
        }
    });

}
function chartLoad3(){
    var ctx = document.getElementById("test3Chart").getContext("2d");
    var dataTime = ['AI상담','모의상담'];
    var graphData = [20,80];

    var data = {
        labels: dataTime,
        datasets: [
            {
                data: graphData,
                backgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ],
                hoverBackgroundColor: [
                    "#00bebc",
                    '#cc0241',
                    "#11a2e1",
                    "#b2bdc2"
                ]
            }]
    };
    var myPieChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: {
            showAllTooltips: true,
            scales: {
                xAxes: [{
                    ticks: {
                         min: 0,
                         max: 120,
                         stepSize : 20
                     },
                     scaleLabel: {
                      display: true,
                      fontFamily :'Nanum Barun Gothic',
                      labelString: '(건)',
                    }
                }],
                yAxes: [{
                    categoryPercentage: 0.7,
                    barPercentage: 0.5,
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
 				mode: 'point',
 				titleFontSize: 16,
                titleFontStyle: 'bold',
                titleFontColor: '#333',
                titleMarginBottom:0,
 				titleFontFamily: 'Nanum Barun Gothic',
 				titleMarginBottom: 2,
                titleMarginLeft: 10,
 				backgroundColor: 'rgb(0,0,0,0)',
 				xPadding: 10,
 				yAlign:20,
 				xAlign:20,
 				callbacks: {
 					title: function(tooltipItem){
 						return '' + tooltipItem[0].xLabel;
 					},
 					label: function(tooltipItem, data){
 						return false;
 					},
 				},
 			},
        }
    });

}














// 세로형 샘플
function humidityGraph(){
   var v_humChart;
   var dataTime = ['intent','완료','상담사','포기'];
   var graphData = [180,900,800,400];

   var ctx = document.getElementById("humChart");
   v_humChart = new Chart(ctx, {
       type: 'bar',
       data: {
           labels: dataTime,
           datasets: [{
               label: '',
               data: graphData,
               backgroundColor: [
                   "#00bebc",
                   '#cc0241',
                   "#11a2e1",
                   "#b2bdc2"
               ],
               borderColor:[
                   "#01adab",
                   '#a50034',
                   "#0291cf",
                   "#91a1a8"
               ],
               borderWidth:1
           }],
       },
       options: {
           scales: {
               xAxes: [{
                   categoryPercentage: 1.0,
                   barPercentage: 0.5,
                   afterTickToLabelConversion: function(data){
                       var xLabels = data.ticks;
                       xLabels.forEach(function (labels, i) {

                           if (i % 4){
                               // xLabels[i] = '';
                           }
                       });
                   },    // xAxes값 배수 조절.........
                   ticks: {
                       maxRotation:0,  // xAxes 가로로...
                       autoSkip:false, // xAxes 갯수를 고정으로
                   },
                   // barPercentage: 1.27, // 바 넓이
               }]
           },
           legend: {
               // display: false
           },   // 범례 노출 여부
           legend: {
               display: false
           },
           tooltips:{
               callbacks: {
                   label: function(tooltipItem, data){
                       var idx = tooltipItem.index;
                       var html = "";
                       for(var dataset in data.datasets){
                           if(data.labels[idx]) {
                               html += "툴팁의 내용 표출" + "<label>" + data.labels[idx] + "and" + data.datasets[dataset].data[idx] + " </label><br/>";
                           }
                       }
                       $('#hum_view').html(html);
                       return data.datasets[dataset].data[idx];
                   }
               },
           },
       }
   });
}
// 가로형 샘플
function testidityGraph(){
   var v_testChart;
   var dataTime = ['intent','완료','상담사','포기'];
   var graphData = [180,900,800,400];

   var ctx = document.getElementById("testChart");
   v_testChart = new Chart(ctx, {
       type: 'horizontalBar',
       data: {
           labels: dataTime,
           datasets: [{
               label: '',
               data: graphData,
               backgroundColor: [
                   "#00bebc",
                   '#cc0241',
                   "#11a2e1",
                   "#b2bdc2"
               ],
               borderColor:[
                   "#01adab",
                   '#a50034',
                   "#0291cf",
                   "#91a1a8"
               ],
               borderWidth:1
           }],



       },
       options: {

           scales: {
               xAxes: [{
                   ticks: {
                        min: 0,
                        max: 1200,
                        stepSize : 200
                    }
               }],
               yAxes: [{
                   categoryPercentage: 1.0,
                   barPercentage: 0.5,
               }]



           },
           legend: {
               display: false
           },
           tooltips:{
               onAnimationComplete: function() {
                    this.showTooltip(this.segments);
                },
               callbacks: {
                   label: function(tooltipItem, data){
                       var idx = tooltipItem.index;
                       var html = "";
                       for(var dataset in data.datasets){
                           if(data.labels[idx]) {
                               html += "툴팁의 내용 표출" + "<label>" + data.labels[idx] + "and" + data.datasets[dataset].data[idx] + " </label><br/>";
                           }
                       }
                       $('#test_view').html(html);
                       return data.datasets[dataset].data[idx];
                   }
               },
           },
       }

   });
}
function test2idityGraph(){
   var v_testChart;
   var dataTime = ['상담사','건수'];
   var graphData = [180,800];

   var ctx = document.getElementById("test2Chart");
   v_testChart = new Chart(ctx, {
       type: 'horizontalBar',
       data: {
           labels: dataTime,
           datasets: [{
               label: '',
               data: graphData,
               backgroundColor: [
                   "#00bebc",
                   '#cc0241',
                   "#11a2e1",
                   "#b2bdc2"
               ],
               borderColor:[
                   "#01adab",
                   '#a50034',
                   "#0291cf",
                   "#91a1a8"
               ],
               borderWidth:1
           }],



       },
       options: {
            showAllTooltips: true,
            // responsive: true,
           scales: {

               xAxes: [{
                   ticks: {
                        min: 0,
                        max: 1200,
                        stepSize : 200
                    },
                    scaleLabel: {
                     display: true,
                     fontFamily :'Nanum Barun Gothic',
                     labelString: '(건)',
                   }
               }],

               yAxes: [{
                   categoryPercentage: 0.7,
                   barPercentage: 0.5,


               }]



           },
           legend: {
               display: false,

           },
           tooltips: {
				mode: 'point',
				titleFontSize: 14,
                titleFontColor: '#fff',
				titleFontFamily: 'Helvetica',
				titleFontStyle: 'normal',
				titleMarginBottom: 2,
				cornerRadius: 0,
				backgroundColor: 'rgb(0,0,0,1)',
				xPadding: 24,
				yAlign: 'bottom',
				xAlign: 'center',
				callbacks: {
					title: function(tooltipItem){
						return '' + tooltipItem[0].xLabel;
					},
					label: function(tooltipItem, data){
						return false;
					},
				}
			},
       }

   });


}
