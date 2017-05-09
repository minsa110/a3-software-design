$(function() {

    d3.csv("../data.csv", function(error, data) {
        var margin = {top: 20, right: 30, bottom: 30, left: 40},
            height = 500,
            width = 960,
            drawHeight = 500 - margin.top - margin.bottom,
            drawWidth = 960 - margin.left - margin.right,
            padding = 0.3;

        var svg = d3.select('#vis')
            .append('svg')
            .attr('height', height)
            .attr('width', width);
        
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 90) + ')')
            .attr('class', 'title');

        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 50) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        var xAxis = d3.axisBottom();
        var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));

        var xScale = d3.scaleBand();
        var yScale = d3.scaleLinear();

        // Transform data (i.e., finding cumulative values and total) for easier charting
        data.push({
            name: 'Total',
            end: cumulative,
            start: 0,
            class: 'total'
        });

        var cumulative = 0;
        for (var i = 0; i < data.length; i++) {
            data[i].start = cumulative;
            cumulative += data[i].value;
            data[i].end = cumulative;

            data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
        }

        var setScales = function(data) {
            var names = data.map(d=>d.name);
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(names);

            var yMax = d3.max(data, d=>+d.end); // end?
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        };

        var setAxes = function() {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel.transition().duration(500).call(xAxis);
            yAxisLabel.transition().duration(500).call(yAxis);

            xAxisText.text('xAxis');
            yAxisText.text('yAxis');
        }
    });

    d3.csv("../data.csv", type, function(error, data) {

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var bar = chart.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", function(d) { return "bar " + d.class })
        .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

    bar.append("rect")
        .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
        .attr("height", function(d) { return Math.abs( y(d.start) - y(d.end) ); })
        .attr("width", x.rangeBand());

    bar.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) { return y(d.end) + 5; })
        .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + ".75em" })
        .text(function(d) { return dollarFormatter(d.end - d.start);});

    bar.filter(function(d) { return d.class != "total" }).append("line")
        .attr("class", "connector")
        .attr("x1", x.rangeBand() + 5 )
        .attr("y1", function(d) { return y(d.end) } )
        .attr("x2", x.rangeBand() / ( 1 - padding) - 5 )
        .attr("y2", function(d) { return y(d.end) } )
    });

    function type(d) {
    d.value = +d.value;
    return d;
    }

    function dollarFormatter(n) {
    n = Math.round(n);
    var result = n;
    if (Math.abs(n) > 1000) {
        result = Math.round(n/1000) + 'K';
    }
    return '$' + result;
    }
})
