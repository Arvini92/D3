// var myStyles = [
//     {
//         name: 'One',
//         width: 200,
//         color: '#268BD2'
//     },
//     {
//         name: 'Two',
//         width: 200,
//         color: '#BD3613'
//     } 
// ];

// d3.selectAll('#bar-chart').selectAll('div')
    // .data(myStyles)
    // .enter().append('div')
    // .classed('item', true)
    // .text(function(d) {
    //     return d.name;
    // })
    // .style({
    //     'color': 'white',
    //     'background': function(d) {
    //         return d.color;
    //     },
    //     width: function(d) {
    //         return d.width + 'px';
    //     }
    // })
    // .style('background', function(d) {
    //     return d;
    // })
    // .style({
    //     'background': '#268BD2'
    // })
    // .classed({
    //     'highlight': true,
    //     'item': false,
    //     'bigger': true,
    // })
    // .classed('highlight', true)
    // .attr('class', 'highlight')
    //.remove()
    // .append('div')
    // .html('<strong>selected</strong>')

    // d3.select('#bar-chart')
    //     .append('svg')
    //         .attr('width', 600)
    //         .attr('height', 400)
    //         .style('background', '#93A1A1')
    //     .append('rect')
    //         .attr('x', 200)
    //         .attr('y', 100)
    //         .attr('width', 200)
    //         .attr('height', 200)
    //         .style('background', '#CB4B19')
    // d3.select('svg')
    //     .append('circle')
    //     .attr('cx', 300)
    //     .attr('cy', 200)
    //     .attr('r', 50)
    //     .style('fill', '#840043')
    
    var bardata = [];

    // bardata.sort(function compareNumbers(a, b) {
    //     return a - b;
    // })

    d3.tsv('data.tsv', function(data) {
        for (key in data) {
            // console.log(data[key])
            bardata = +data[key]
        }
        // console.log(bardata)
        return bardata
    }).then((bardata) => {
        var margin = { top: 30, right: 30, bottom: 40, left: 50 }

        var tempColor;

        var height = 400 - margin.top - margin.bottom,
            width = 600 - margin.left - margin.right,
            barWidth = 50,
            barOffset = 5;

        var colors = d3.scaleLinear()
            .domain([0, bardata.length *.33, bardata.length *.66, bardata.length])
            .range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(bardata)])
            .range([0, height])

        var xScale = d3.scaleBand()
            .domain(d3.range(0, bardata.length))
            .range([0, width])

        var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0)

        var myChart = d3.select('#bar-chart')
            .append('svg')
                .style('background', '#E7E0CB')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left +', '+ margin.top +')')
                .style('background', '#C9D7D6')
                .selectAll('rect').data(bardata)
                .enter().append('rect')
                    // .transition().duration(800)
                    .style('fill', function(d, i) {
                        return colors(i);
                    })
                    .attr('width', xScale.bandwidth())
                    // .attr('height', function(d) {
                    //     return yScale(d);
                    // })
                    .attr('x', function(d, i) {
                        return xScale(i);
                    })
                    // .attr('y', function(d) {
                    //     return height - yScale(d);
                    // })
                    .attr('height', 0)
                    .attr('y', height)
            .on('mouseover', function(d) {

                tooltip.transition()
                    .style('opacity', .9)

                tooltip.html(d)
                    .style('left', (d3.event.pageX -35) + 'px')
                    .style('top', (d3.event.pageY - 30) + 'px')

                tempColor = this.style.fill;
                d3.select(this)
                    // .transition()
                    .style('opacity', .5)
                    .style('fill', 'yellow')
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    // .transition()
                    // .deley(500).duration(800)
                    .style('opacity', 1)
                    .style('fill', tempColor)
            })
        
            myChart.transition()
                .attr('height', function(d) {
                    return yScale(d);
                })
                .attr('y', function(d) {
                    return height - yScale(d);
                })
                .delay(function(d, i) {
                    return i * 20;
                })
                .duration(1000)
                .ease(d3.easeLinear)

            var vGuideScale = d3.scaleLinear()
                .domain([0, d3.max(bardata)])
                .range([height, 0])

            var vAxis = d3.axisLeft(vGuideScale)
                // .orient('left')
                .ticks(10)

            var vGuide = d3.select('svg').append('g')
            vAxis(vGuide)
            vGuide.attr('transform', 'translate(' + margin.left + ', '+ margin.top +')')
            vGuide.selectAll('path')
                .style('fill', 'none')
                .style('stroke', "#000")
            vGuide.selectAll('line')
                .style('stroke', "#000")

            var hAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(d, i) {
                    return !(i % (bardata.length/5));
                }))

            var hGuide = d3.select('svg').append('g')
                hAxis(hGuide)
                hGuide.attr('transform', 'translate(' + margin.left + ', '+ (height + margin.top) +')')
                hGuide.selectAll('path')
                    .style('fill', 'none')
                    .style('stroke', "#000")
                hGuide.selectAll('line')
                    .style('stroke', "#000")
    })

    
