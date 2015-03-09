

var topword_json = null;

var frozen = false;
var last_freeze = null;

function top_words_mouseover(d) {
    
    d3.select(this).style('stroke-width', 1.5).style('stroke', 'black');
    
    if(!frozen) {
        set_top_words(get_name(d));
    }
}

function set_top_words(name) {
    var words = topword_json[name];
    if (words) {

        var xnwords = height/33;
        console.log("NW:" + xnwords);
        words = words.slice(0,xnwords);
        var topwords = d3.select("#goodwords");

        var newwords = topwords.selectAll("li").data(words);

        newwords.transition()
            .duration(200)
            .style("opacity",0)
            .transition()
            .duration(200)
            .text(function (dd) {return dd;})
            .style("opacity","1");
        
        newwords.enter().append("li").style("opacity",0).transition()
            .duration(200)
            .text(function (dd) {return dd;})
            .style("opacity","1");

        newwords.exit().remove();
        
        newwords.on("mouseover",function() {
            d3.select(this).style("background","#ccc");
        })
            .on("mouseout",function() {
                d3.select(this).style("background","#FFF");
            }).on("click",function(d) {
                topword_recolor(d); 
            });
        
    }
}


function setup_top_words() {

    //cleanup();
    
    frozen = false;
    
    d3.json("/topwords/" + cityname, function (error, topwords) {
        topword_json = topwords;
    });
    
    svg.selectAll("g").selectAll("path")
        .transition().duration(600).style('fill',"#ccc");

    svg.selectAll("g").selectAll("path")
        .on("click", function (d) {
            var cur = get_name(d);

            if(!frozen || cur != last_freeze) {
                frozen = true;
                last_freeze = cur;
                svg.selectAll("g").selectAll("path").on("mouseover", function (d) {
                    default_mouseover(d,d3.select(this))
                }).transition().duration(500).style('fill',function(d2) {
                    if(cur == get_name(d2))
                        return '#faa';
                    else
                        return '#ccc';
                })
                set_top_words(cur);
            } else {
                //it was frozen and we clicked the same one
                frozen = false;
                last_freeze = null;
                svg.selectAll("g").selectAll("path").on("mouseover", top_words_mouseover)
                    .transition().duration(500).style('fill',"#ccc");
            }                                          
        })
        .on("mouseover", top_words_mouseover);
    
    var topwords_leftbar = d3.select("#container").insert("div","#mainmap").attr("id","leftbar").style("height",height + "px");

    topwords_leftbar.style("left","0px").style("z-index","-5").transition().duration(600).style("left","-250px").each("end",function() {
        d3.select(this).style("z-index","0");
    });

    
    var topwords_rightbar = d3.select("#container").append("div").attr("id","rightbar").style("height",height + "px");
    
    topwords_rightbar.style("left",(width-400)+ "px").style("width","400px").style("z-index","-5").transition().duration(600).style("left",width + "px").each("end",function() {
        d3.select(this).style("z-index","0");
    });

    topwords_rightbar.append("div").append("input").attr("id","wordsearch");

    var search_button = topwords_rightbar.append("div").attr("class","sidebutton").attr("id","searchbutton");

    var search_image = search_button.append("img").on("click", function() {
        topword_recolor(document.getElementById('wordsearch').value);
    }).attr("src",function(d) {
        return "/static/assets/images/searchicon.png";
    });

    var search_label = search_button.append("div").attr("class","buttonlabel").text("Search");

    topwords_leftbar.append("ul").attr("id","goodwords")

}


function topword_recolor(word) {

    console.log("CHECK " + word);

    word = word.replace("#","%23")
    
    d3.json(wordbase + word, function (error, wordinfo) {

        if(wordinfo.error) {
            console.log("NOT FOUND")
            return;
        }
        
        var color_scale = d3.scale.quantize().range(colorbrewer.Reds[9]);
        var gamma_scale = d3.scale.linear().range([0,1]);

        mapname = word;
        brewerscale = "reds";
        
        var values = [];
        for(i in wordinfo.probs) {
            var w = wordinfo.probs[i];
            values.push(w);
        }

        color_scale.domain([0,1]);
        gamma_scale.domain(d3.extent(values));
        
        svg.selectAll("g").selectAll("path")
            .transition().duration(600).style('fill',function(d) {
                var v = wordinfo.probs[get_name(d)];
                d.raw = gamma_scale(v);
                return color_scale(Math.pow(gamma_scale(v),.5));
            });
        
    });

    

        /**
           svg.selectAll("g").selectAll("path")
        .transition().duration(600).style('fill',function(d) {
            var words = topword_json[get_name(d)];
            if(words.indexOf(word) != -1) {
                return "#f00";
            } else {
                return "#ccc";
            }
        });
       */    

}
