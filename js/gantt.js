// var gantt = function() {
//     var margin = {top: 20, right: 30, bottom: 30, left: 40},
//         width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom,
//         padding = 0.3;

//     var xScale = d3.scale.ordinal()
//         .rangeRoundBands([0, width], padding);

//     var yScale = d3.scale.linear()
//         .range([height, 0]);

//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");

//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left")
//         .tickFormat(function(d) { return dollarFormatter(d); });
// }