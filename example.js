$(function() {
    d3.csv('data.csv', function(error, data) {
        var tasks = function() {
            chartData = data.map(function(d) {
                return {
                    startDate: new Date(d.startDate),
                    endDate: new Date(d.endDate),
                    taskName: d.taskName,
                    status: d.status
                }
            })
        }
        tasks();
        chartData.sort(function(a, b) {
            return a.endDate - b.endDate;
        });
        var maxDate = chartData[chartData.length - 1].endDate;
        chartData.sort(function(a, b) {
            return a.startDate - b.startDate;
        });
        var minDate = chartData[0].startDate;

        var format = "%d, %H:%M";

        var nestedData = d3.nest().key(function(d) {
            return d.taskName;
        }).entries(data);
        var taskNames = nestedData.map(function(d) { return d.key; })

        var gantt = GanttChart().taskTypes(taskNames).tickFormat(format).taskStatusColor("FAILED", "orange");

        var selected = d3.select("#vis");
        gantt(selected, chartData);
    });
});