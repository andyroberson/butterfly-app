//variable for tracking animation; is null until "start animation" button has been clicked
var i;

//set height and width of the map
var width = 860,
    height = 500;

//reporting that the button was clicked, and so set i to 0 to set the animation (which can't start until i has been set)
function report() {
     i = 0;
     console.log("i is true");
}

//centering and positioning map to show north america
var projection = d3.geo.mercator()
    .center([100, 35 ])
    .scale(600)
    .rotate([-180,0]);

//add svg to the div, assign the height and widths
var svg = d3.select(".map-container").append("svg")
    .attr("width", width)
    .attr("height", height);
    // .attr("viewBox", "0 0 500 860")
    // .attr("preserveAspectRation", "xMinYmin meet");


var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// load tracking information
d3.json("track2.json", function(error, track) {
d3.json("world-110m2.json", function(error, topology) {

var color_scale = d3.scale.quantile().domain([1, 5]).range(colorbrewer.YlOrRd[5]);

//create map
g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)

      //hide all countries but USA(840) and mexico (484)
      .style("display", function(g) {
        if (g.id == 840 || g.id == 484)
            {return "auto"}
        else {return "none"}
      })
      //change colors of countries
      .style("fill", function(g) {
        if (g.id == 840 || g.id == 484)
            {return "purple"}
      });

      //dateText shows what's happening to the Monarch during the migration depending on the Month
      var dateText = svg.append("text")
        .attr("id", "dataTitle")
        .text(track[0].month + ": " + track[0].action)
        .attr("x", 70)
        .attr("y", 20)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black");

      //creating svg path
      var pathLine = d3.svg.line()
          .interpolate("cardinal")
          .x(function(d) { return projection([d.lon, d.lat])[0]; })
          .y(function(d) { return projection([d.lon, d.lat])[1]; });


      //migration route path
      var migrationRoute = svg.append("path")
      .attr("d",pathLine(track))
      .attr("fill","none")
      .attr("stroke", color_scale(track[0].class))
      .attr("stroke-width", 3)

      //styling
      .style('stroke-dasharray', function(d) {
        var l = d3.select(this).node().getTotalLength();
        return l + 'px, ' + l + 'px';
      })
      .style('stroke-dashoffset', function(d) {
        return d3.select(this).node().getTotalLength() + 'px';
       });


      var migrationRouteEl = migrationRoute.node();
      var migrationRouteElLen = migrationRouteEl.getTotalLength();

      var pt = migrationRouteEl.getPointAtLength(0);

      //butterfly "d" 1
      var icon = svg.append("path")
      .attr("d", "m 0,0 c 0,0 -1.785,9.652 -5.295,6.992 m 11.458,0 C 2.652,9.652 0.868,0 0.868,0 m -2.624,-2.933 -0.019,-28.673 c 0,0 2.163,-5.271 4.672,0.056 L 2.878,-2.903 m 0.057,-6.748 c 0,0 11.864,17.454 27.875,15.7 0,0 9.222,-0.924 5.712,-5.749 0,0 -4.601,-1.353 -6.794,-6.617 -2.193,-5.264 -5.997,-11.662 -9.576,-11.662 l -17.255,0 c 0,0 21.133,-0.17 21.572,-15.524 0,0 0,-4.287 -5.922,-3.41 -5.922,0.877 -16.166,-1.595 -15.65,5.423 L 2.878,-2.903 c 0,0 0.096,2.924 -2.097,2.924 l -0.44,0 c -2.193,0 -2.097,-2.954 -2.097,-2.954 l -0.019,-28.675 c 0.516,-7.018 -9.728,-4.577 -15.65,-5.454 -5.922,-0.877 -5.922,3.545 -5.922,3.545 0.439,15.353 21.572,15.538 21.572,15.538 l -17.255,0 c -3.579,0 -7.383,6.398 -9.576,11.662 -2.193,5.264 -6.795,6.737 -6.795,6.737 -3.509,4.825 5.713,5.689 5.713,5.689 16.011,1.754 27.874,-15.73 27.874,-15.73")
      .attr("transform",  "translate(" + pt.x + "," + pt.y + "), scale(.5), rotate(180)")
      .attr("fill", "orange")
      .attr("class","icon");

      //animate icon
      var animation = setInterval(function(){
        pt = migrationRouteEl.getPointAtLength(migrationRouteElLen*i/track.length);
        icon
          .transition()
          .ease("linear")
          .duration(300)
          .attr("transform", "translate(" + pt.x + "," + pt.y + "), scale(.5), rotate(180)");

        //transitions
        migrationRoute
          .transition()
          .duration(300)
          .ease("linear")
          .attr("stroke", color_scale(track[i].class))
          //delay line starting if desired
          .style('stroke-dashoffset', function(d) {
            var stroke_offset = (migrationRouteElLen - migrationRouteElLen*i/track.length + 10);
            return (migrationRouteElLen < stroke_offset) ? migrationRouteElLen : stroke_offset + 'px';
          });

        //change text based on point
        dateText
          .text(track[i].month + ": " + track[i].action)
          .attr("fill", "black");
        i = i + 1;

        //if i is track.lenght, it is looped through json file and needs to restart, so set i back to null
        if (i==track.length)
          clearInterval(
            function() {
              i = null;
              console.log("i is null");
            }
          );
      },300);

  });
});
