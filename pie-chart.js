var width = 400,
    height = 400,
    radius = 200
    colors = d3.scaleOrdinal()
        .range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

var piedata = [
    { 
        label: "Barot",
        value: 50
    },
    {
        label: "Gerard",
        value: 50
    },
    {
        label: "Jeninifer",
        value: 50
    }
]

var pie = d3.pie()
    .value(function(d) {
        return d.value;
    })

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

var myChart = d3.select('#pie-chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
        .attr('transform', 'translate(' + (width - radius)+','+(height-radius)+')')
        .selectAll('path').data(pie(piedata))
        .enter().append('g')
            .attr('class', 'slice')

var slices = d3.selectAll('g.slice')
            .append('path')
            .attr('fill', function(d, i) {
                return colors(i);
            })
            .attr('d', arc)

var text = d3.selectAll('g.slice')
            .append('text')
            .text(function(d, i) {
                return d.data.label;
            })
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('transform', function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return 'translate(' + arc.centroid(d) + ')'
            })
