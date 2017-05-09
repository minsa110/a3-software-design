var GanttChart = function() {
  var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 150
  };
  var timeDomainStart = d3.timeDay.offset(new Date(),-3);
  var timeDomainEnd = d3.timeHour.offset(new Date(),+3);
  var taskTypes = [];
  var taskStatus = [];
  var height = 500 - margin.top - margin.bottom-5;
  var width = 960 - margin.right - margin.left-5;

  var tickFormat = "%H:%M";

  var taskStatus = {
            "SUCCEEDED" : "bar-succeeded",
            "FAILED" : "bar-failed",
            "RUNNING" : "bar-running",
            "KILLED" : "bar-killed"
        };

  var xScale,
      yScale,
      xAxis,
      yAxis;

  var keyFunction = function(d) {
    return d.startDate + d.taskName + d.endDate;
  };

  var rectTransform = function(d) {
    return "translate(" + xScale(d.startDate) + "," + yScale(d.taskName) + ")";
  };

  var initTimeDomain = function(tasks) {
    if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = d3.time.day.offset(new Date(), -3);
        timeDomainEnd = d3.time.hour.offset(new Date(), +3);
        return;
    }
    tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
    });
    timeDomainEnd = tasks[tasks.length - 1].endDate;
    tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
    });
    timeDomainStart = tasks[0].startDate;
  };

 function setAxes() {
    xScale = d3.scaleTime()
        .domain([ timeDomainStart, timeDomainEnd ])
        .range([ 0, width ]);
    yScale = d3.scaleBand()
        .domain(taskTypes)
        .rangeRound([ 0, height - margin.top - margin.bottom ], .1);

    xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat(tickFormat))
        .tickSize(8)
        .tickPadding(8);

    yAxis = d3.axisLeft()
        .scale(yScale)
        .tickSize(0);
  };

var gantt = function(selectedDiv, tasks) {
    initTimeDomain(tasks);
    setAxes();

    var svg = selectedDiv
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "gantt-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    svg.selectAll(".chart")
      .data(tasks, keyFunction).enter()
      .append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function(d){ 
        if(taskStatus[d.status] == null){ return "bar-succeeded";}
        return taskStatus[d.status];
      }) 
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function(d) { return 70; })
      .attr("width", function(d) { 
        return (xScale(d.endDate) - xScale(d.startDate)); 
      });

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
        .transition()
        .call(xAxis);

      svg.append("g").attr("class", "y axis").transition().call(yAxis);

        // var nestedData = d3.nest().key(function(d) {
        //     return d.taskName;
        // }).entries(tasks);
        // var taskNames = nestedData.map(function(d) { return d.key; })

      // var legend = svg.selectAll(".legend").data(taskNames).enter().append("g").attr("class", "legend")
      //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      // legend.append("rect")
      //https://github.com/minsa110/a2-data-exploration/blob/master/js/main.js

      return gantt;
}

 gantt.taskTypes = function(value) {
    if (!arguments.length) return taskTypes;
    taskTypes = value;
    return gantt;
  };

  gantt.width = function(value) {
    if (!arguments.length) return width;
    width = +value;
    return gantt;
  };

  gantt.height = function(value) {
    if (!arguments.length) return height;
    height = +value;
    return gantt;
  };

  gantt.tickFormat = function(value) {
    if (!arguments.length) return tickFormat;
    tickFormat = value;
    return gantt;
  };

  gantt.taskStatus = function(value) {
    if (!arguments.length) return taskStatus;
    taskStatus = value;
    return gantt;
  };

  gantt.taskStatusColor = function(task, color) {
      if (!arguments.length) return taskStatus;
      $("."+taskStatus[task]).css('fill', color)
      return gantt;
  }

  return gantt;
};