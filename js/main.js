$(function() {
    d3.csv('../data/data.csv', function(error, data) {
        var chartData;
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    startDate: new Date(d.startDate),
                    endDate: new Date(d.endDate),
                    taskName: d.taskName,
                    status: d.status
                }
            })
        }
        prepData();
        
        var taskNames = ["Task 1", "Task 2", "Task 3", "Task 4"]
        var format = "%d-%H:%M";

        // var gantt = GanttChart()
        //     .tickFormat(format)
        //     .statusColors(d3.schemeCategory20b)
        //     .displayLegend(true)
        //     .hoverEffect(true)
        //     .width(1000)
        //     .height(500)
        //     .barHeight(110);
        var gantt = GanttChart();
        var charts = d3.select("#vis").datum(chartData).call(gantt)
    });
});