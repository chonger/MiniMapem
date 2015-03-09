
var truewidth = 1080,
trueheight = 850;

var maxmap = window.innerHeight - 130 - 75,
height = maxmap,
mscale = maxmap / trueheight,
width = mscale * truewidth;


var projection = d3.geo.mercator()
    .center([centerlat, centerlng])
    .scale(citymapzoom);

var path = d3.geo.path()
    .projection(projection);

var container = d3.select("#viz").append("div").attr("id", "container").style("width",width + "px");

var svg = container.append("svg").attr("id","mainmap")
    .attr("fill","#FFF")
    .attr("width", width)
    .attr("height", height);

var add2notebook = container.append("img").attr("id","add2notebook")
    .attr("src","/static/assets/images/notebook.png");

var tooltip = container.append("div")
    .attr("class", "tooltip")
    .html('')
    .style("opacity", 0.95)
    .style('display', 'none')
    .style("left", (width - 270) + "px")
    .style("top", "4px");

var tooltip2 = container.append("div")
    .attr("class", "tooltip")
    .html('')
    .style("opacity", 0.95)
    .style('display', 'none')
    .style("left", "4px")
    .style("top", "4px");

var legend_out = container.append("div")
    .attr("id", "legend")
    .style("right", "0px")
    .style("bottom","4px")

var legend_label = legend_out.append('div').attr('id','legend_label');
var legend = legend_out.append('ul').attr('class', 'list-inline');

function set_legend(color_scale,label) {
    
    legend_label.text(label);
    
    legend.selectAll("li").remove();
    
    var keys = legend.selectAll('li')
        .data(color_scale.range()).enter()
        .append('li')
        .attr('class', 'key')
        .style('border-top-color', String)
        .style('text-padding', "10px")
        .text(function (d) {
            var r = color_scale.invertExtent(d);

            console.log(r);
            if(r[0] > 1000)
                return d3.round(r[0],-3)/1000 + "K";
            
            return d3.round(r[0],1);
        });
}


svg.html("");

function default_mouseover(d,thethis) {
    thethis.style('stroke-width', 1.5).style('stroke', 'black');
}

function remove_behavior(sel) {
    sel.on("mouseover", function(d) {default_mouseover(d,d3.select(this));})
        .on("mouseout", function (d) {
            d3.select(this).style('stroke-width', .7).style('stroke', '#55aadd');
            tooltip.style("display", "none").html("");
        }).on("click",function() {});
    
}

d3.json(pathbase + "regions.geojson", function (error, topology) {
    svg.append("g").selectAll("path")
        .data(topology.features)
        .enter().append("path")
        .attr("d", path)
        .attr("transform","translate(0,0) scale(" + mscale + ")")
        .style('stroke-width', .7).style('stroke', '#55aadd')
        .style('fill', function (d) {
            return "#ccc";
        })
        .attr("class", "region")
        .on("mouseover", function (d) {
            d3.select(this).style('stroke-width', 1.5).style('stroke', 'black');
        })
        .on("mouseout", function (d) {
            d3.select(this).style('stroke-width', .7).style('stroke', '#55aadd');
            tooltip.style("display", "none").html("");
        });
    

    setup_top_words();
});


function setviz(key) {

    //Disabled for design

}

function get_name(feat) {

    var props = feat['properties']

    var name = null;
    if ('GEOID10' in props) {
        name = props['GEOID10']
    } else if('GEO_ID' in props) {
        name = props['GEO_ID'].slice(-11)
    }

    return name
    
}





