var w = 900,
    h = 400;

var circleWidth = 5;

var palette = {
    red: '#B58929', 
    green: '#C61C6F', 
    blue: '#268BD2', 
    white: '#85992C'
}

var nodes = [
    { name: "Parent" },
    { name: "child1"},
    { name: "child2", target: [0] },
    { name: "child3", target: [0] },
    { name: "child4", target: [1] },
    { name: "child5", target: [0, 1, 2, 3] },
]

var links = []

for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].target !== undefined) {
        for (var x = 0; x < nodes[i].target.length; x++) {
            links.push({
                source: nodes[i],
                target: nodes[nodes[i].target[x]]
            })
        }
    }
}

var myChart = d3.select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

var force = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d, i) { return i }))
    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(w / 2, h / 2))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0))
    .nodes(nodes)
    // .links([])
    // .gravity(0.1)
    // .charge(-1000)
    // .size([w, h])

var link = myChart.selectAll('line')
    .data(links).enter().append('line')
    .attr('stroke', palette.white)

var node = myChart.selectAll('circle')
    .data(nodes).enter()
    .append('g')
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', circleWidth)
    .attr('fill', function(d) {
        if (i>0) { return palette.red }
        else { return palette.blue }
    })

node.append('text')
    .text(function(d) { return d.name })
    .attr('font-family', 'Roboto-Slab')
    .attr('fill', function(d) {
        if (i>0) { return palette.white }
        else { return palette.green }
    })
    .attr('x', function(d, i) {
        if (i>0) { return circleWidth + 4 }
        else { return circleWidth - 15 }
    })
    .attr('y', function(d, i) {
        if (i>0) { return circleWidth }
        else { return 8 }
    })
    .attr('text-anchor', function(d, i) {
        if (i>0) { return 'beginning' }
        else { return 'end' }
    })
    .attr('font-size',  function(d, i) {
        if (i>0) { return '1em' }
        else { return '1.8em' }
    })

force.on('tick', function(e) {
    node.attr('transform', function(d, i) {
        return 'translate('+ d.x + ',' + d.y + ')'
    })

    link
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y })
})

function dragstarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}