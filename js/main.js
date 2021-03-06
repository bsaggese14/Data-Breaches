function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var width = 700
	height = 500

svg = d3.select(".mainViz").append("svg")
	.attr("width", width)
    .attr("height", height);

var xScale = d3.scale.linear()
    .domain([2004, 2016])
    .range([0, width]);


var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));

svg.append("text").attr("x", width/2 - 150).attr("y", -150).text("Data Breaches (2004-Present)");
svg.append("g").attr("class", "axis").attr("transform", "translate(0, "+height+")").call(xAxis);
svg.append("text").attr("x", 0).attr("transform", "translate(-150, 0)").attr("y", -30).text("# Accounts Compromised");

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);// load data

function makeViz(max) {

    d3.selectAll(".mainCircle").remove();
    d3.selectAll(".yaxis").remove();
    var rScale = d3.scale.linear()
    .domain([0, max])
    .range([5,100]);

    var yScale = d3.scale.linear()
    .domain([0, max])
    .range([height, 0]);

    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    svg.append("g").attr("class", "axis yaxis").attr("transform", "translate(-50, 0)").call(yAxis);

    d3.json("js/breaches.json", function(error, json) {
        json["breaches"].forEach(function(entry) {

            var numStolen = parseInt(entry["numStolen"])
            var reason = entry["reason"]
            var sector = entry["sector"]
            var companyName = entry["companyName"]
            var moreInfo = entry["moreInfo"]
            var year = parseInt(entry["year"]);

            if(numStolen <= max) {
                svg.append("circle")
                    .attr("class", "mainCircle")
                    .on("mouseover", function() {

                        var toolTipX = this.cx.baseVal.value
                        var toolTipY = this.cy.baseVal.value
                        var circleR = this.r.baseVal.value
                        var xPos = 0;

                        if(toolTipX > width/2) {
                            xPos = toolTipX - circleR;
                            console.log("greater");
                        }
                        else {
                            xPos = toolTipX + 400;
                        }
                        div.transition()        
                            .duration(200)      
                            .style("opacity", 1);      
                        div.html("<span class = 'companyName'>"+companyName+"</span><br/>"+moreInfo)  
                            .style("position", "absolute")
                            .style("width", 300)
                            .style("border","solid .5px black")
                            .style("border-radius", "3px")
                            .style("background-color", "white")
                            .style("padding", 10)
                            .style("box-shadow", "5px 5px 5px 0px rgba(71,70,71,1)")
                            .style("left", xPos)     
                            .style("top", toolTipY + 300 + "px");    

                    })
                    .on("mouseout", function() {
                        d3.selectAll(".toolTip").style("border","none").style("box-shadow", "0px 0px 0px 0px rgba(71,70,71,1)").style("background-color", "transparent").html("")
                    })
                    .attr("cx", function() {
                        if (!isNaN(year)) {
                            return xScale(year)
                        }
                        else {
                           // console.log("yearErr: "+year)
                        }
                    })
                    .attr("cy", function() {
                        if(!isNaN(numStolen)) {
                            return yScale(numStolen)
                        }
                        else {
                            //console.log("numstolen error: "+numStolen)
                        }        
                    })
                    .attr("r", function() {
                        if(!isNaN(numStolen)) {
                            return rScale(numStolen)
                        }
                        else {
                            //console.log("numstolen error: "+numStolen)
                        }
                    });
            }
        })
    });
}
makeViz(500000000);
$("#changeScale").on("input change", function() {
    //$(".sliderInput").html(numberWithCommas($("#changeScale").val()))
    makeViz($("#changeScale").val());
});

var width2 = 500
    height2 = 500

svg3 = d3.select(".thirdViz").append("svg")
    .attr("width", width2)
    .attr("height", height2);



var reasonsList = {"lost / stolen": 48, "poor security": 13, "hacked": 157, "accidentally published": 19, "inside job": 17}
var reasonsListValues = [48,13,157,19,17]
var sectorList = {"web": 92, "financial": 41, "retail": 17, "government": 46, "academic": 9, "healthcare": 39, "military": 18, "telecoms": 9, "gaming": 11} 
var xScale2 = d3.scale.linear()
    .domain([0, 160])
    .range([0, width2]);

svg3.append("rect").attr("x", "0").attr("y", "0").attr("height", "90").attr("width", xScale2(157)).style("fill", "#C4ABFE");
svg3.append("rect").attr("x", "0").attr("y", "100").attr("height", "90").attr("width", xScale2(48)).style("fill", "#2FAACE");
svg3.append("rect").attr("x", "0").attr("y", "200").attr("height", "90").attr("width", xScale2(17)).style("fill", "#8BFEA8");
svg3.append("rect").attr("x", "0").attr("y", "300").attr("height", "90").attr("width", xScale2(19)).style("fill", "#2966B8");
svg3.append("rect").attr("x", "0").attr("y", "400").attr("height", "90").attr("width", xScale2(13)).style("fill", "#FF4848");

svg3.append("text").attr("x", 100).attr("y", "-65").text("Reasons for Breaches").attr("class", "subTitle");
d3.select(".bubbleChart").append("text").attr("x", width2/2).attr("y", "0").text("Sectors of Breaches (Data from above)").attr("class", "subTitle");

svg3.append("text").attr("x", "-80").attr("y", "50").text("hacked");
svg3.append("text").attr("x", "-120").attr("y", "150").text("lost hard drive ");
svg3.append("text").attr("x", "-100").attr("y", "250").text("inside job");
svg3.append("text").attr("x", "-190").attr("y", "350").text("accidentally published");
svg3.append("text").attr("x", "-180").attr("y", "450").text("weak/no encryption");

svg3.append("text").attr("x", xScale2(157)/2).attr("y", "50").text("157");
svg3.append("text").attr("x", xScale2(48)/2).attr("y", "150").text("48");
svg3.append("text").attr("x", xScale2(17)/2-10).attr("y", "250").text("17");
svg3.append("text").attr("x", xScale2(19)/2-10).attr("y", "350").text("19");
svg3.append("text").attr("x", xScale2(13)/2-10).attr("y", "450").text("13");

//for use with csv. below is code for json
// d3.csv("DataBreaches.csv", function(error, data) {

//   var count = 0;
//  // var count2 = 0;

//    data.forEach(function(d) {
    
//     var numStolen = parseInt(d["metric_001"])
//     var reason = d["type"]
//     var sector = d["category"]
//     var companyName = d["name"]
//     var moreInfo = d["notes"]
//     //0 = 2004, 
//     var year = parseInt(d["primaryvalue"])+2004;
//      $("body").append('{"year": "'+year+'", "sector": "'+sector+'", "companyName": "'+companyName+'", "numStolen": "'+numStolen+'", "reason": "'+reason+'", "moreInfo": "'+moreInfo+'"},<br>');

 //    count++;

 //  });

 // });

//$(window).scroll(function() {
//     if($(window).scrollTop() > 700) {
//         $(".tempDiv").removeClass("slideDiv")
//         $(".tempDiv").addClass("absolute")

//     }
//     else {
//         $(".tempDiv").addClass("slideDiv")
//         $(".tempDiv").removeClass("absolute")

//     }
// })
