var GanttChart = function() {
  var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 150
  };
  var timeDomainStart = d3.timeDay.offset(new Date(),-3),
      timeDomainEnd = d3.timeHour.offset(new Date(),+3),
      taskTypes = ["A", "B", "C", "D"],
      taskStatus = [],
      height = 500 - margin.top - margin.bottom-5,
      width = 960 - margin.right - margin.left-5,
      barHeight = Math.round(height / (taskTypes.length * 1.5)),
      colors = ["#33b5e5", "#CC0000", "#669900", "#ffbb33"],
      colorScale,
      statusNames,
      displayLegend = true,
      hoverSelected = true;

  var xScale,
        yScale,
        xAxis,
        yAxis;
  
  var tickFormat = "%H:%M";

  var keyFunction = function(d) {
    return d.startDate + d.taskName + d.endDate;
  };

  var rectTransform = function(d) {
    return "translate(" + xScale(new Date(d.startDate)) + "," + yScale(d.taskName) + ")";
  };

  var initializeTimeDomain = function(tasks) {
    tasks.sort(function(a, b) {
        return new Date(a.endDate) - new Date(b.endDate);
    });
    timeDomainEnd = new Date(tasks[tasks.length - 1].endDate);
    tasks.sort(function(a, b) {
        return new Date(a.startDate) - new Date(b.startDate);
    });
    timeDomainStart = new Date(tasks[0].startDate);
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

  function setColorScales(tasks) {
    var nestedData = d3.nest().key(function(d) {
            return d.status;
        }).entries(tasks);

    taskStatus = nestedData.map(function(d) { return d.key; });

    colorScale = d3.scaleOrdinal(colors)
    colorScale.domain(taskStatus)
  }

  function setTypes(tasks) {
      var nestedData = d3.nest().key(function(d) {
              return d.taskName;
          }).entries(tasks);

      taskTypes = nestedData.map(function(d) { return d.key; });
  }

function gantt(selection) {
  selection.each(function(tasks) {
    initializeTimeDomain(tasks);
    setColorScales(tasks);
    setTypes(tasks);
    setAxes();

    var ele = d3.select(this);
    var mySvg = ele.selectAll("svg").data([tasks]);

    var svg = mySvg.enter()
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "gantt-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
        .transition()
        .call(xAxis);

      svg.append("g").attr("class", "y axis").transition().call(yAxis);

      var rects = svg.selectAll(".chart")
      .data(tasks, keyFunction)
      .enter()
      .append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function(d){ 
        if(taskStatus[d.status] == null){ return "bar-running";}
        return taskStatus[d.status];
      })
      .style("fill", d=>colorScale(d.status)) 
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function(d) {
        return (barHeight);
      })
      .attr("width", function(d) { 
        return (xScale(new Date(d.endDate)) - xScale(new Date(d.startDate))); 
      });

      if (hoverSelected) {
        rects
          .on('mouseover', function(d) { return d3.select(this).style('opacity', 0.5)})
          .on('mouseout', function(d) {return d3.select(this).style('opacity', 1)});
      }

      rects.exit().remove();

      if (displayLegend) {
        var legend = svg.selectAll(".legend")
                      .data(taskStatus)
                      .enter().append("g")
                      .attr("class", "legend")
                      .style("font-size", "11px")
                      .style("font-family", "arial")
                      .attr("transform", function(d, i) { return "translate(40," + (i * 20 + 300) + ")"; });

                  legend.append("rect")
                      .attr("x", width - 18)
                      .attr("width", 18)
                      .attr("height", 18)
                      .style("fill", colorScale);

                  legend.append("text")
                      .attr("x", width - 24)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .style("text-anchor", "end")
                      .text(d=>d);
      }
      return gantt;
  })
}

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

  gantt.barHeight = function(value) {
    if (!arguments.length) return barHeight;
    barHeight = value;
    return gantt;
  }

  gantt.statusColors = function(value) {
    if (!arguments.length) return colors;
    colors = value;
    return gantt;
  }

  gantt.displayLegend = function(value) {
    if (!arguments.length) return displayLegend;
    displayLegend = value;
    return gantt;
  }

  gantt.hoverEffect = function(value) {
    if (!arguments.length) return hoverSelected;
    hoverSelected = value;
    return gantt;
  }
  
  return gantt;
};
