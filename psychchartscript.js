const svgHeight = 400;
const svgWidth = 450;
const margin = {top:20, right:20, bottom:50, left:50};
const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.right - margin.left;

document.addEventListener("DOMContentLoaded", function(event){
          drawChart();
});

function drawChart(){

        const svg = d3.select("#psychro")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight)
                      .append("g")
                      .attr("transform",
                      "translate(" + margin.left + "," + margin.top +")");

        //Clip path
        svg.append("clipPath")       // define a clip path
              .attr("id", "chartclip") // give the clipPath an ID
              .append("rect")          // shape it as an rect
              .attr("x", 0)        
              .attr("y", 0)    
              .attr("width", width)
              .attr("height", height);   

        //Add Scale and Axis
        const xscale = d3.scaleLinear()
              .range([0,width])
              .domain([0,50]);

        const yscale = d3.scaleLinear()
                  .range([height,0])
                  .domain([0,30]);

        const xaxis = d3.axisBottom().scale(xscale).ticks(10);
        const yaxis = d3.axisLeft().scale(yscale).ticks(6);
  
        const xaxisgrid = d3.axisBottom(xscale).tickSize(-svgHeight).tickFormat('').ticks(10);
        const yaxisgrid = d3.axisLeft(yscale).tickSize(-svgWidth).tickFormat('').ticks(6);

        svg.append("g")
          .attr("class","axis")
          .attr("transform","translate(0," + height + ")")
          .call(xaxis);

        svg.append("g")
          .attr("class","axis")      
          .call(yaxis);

        svg.append("text")
          .attr("transform","translate(-30,"+(height/2)+")rotate(-90)")
          .attr("text-anchor","middle")
          .text("Humidity Ratio (g/Kg)");

        svg.append("text")
          .attr("transform","translate("+(width/2)+","+(height+margin.top+20)+")")
          .attr("text-anchor","middle")
          .text("Dry Bulb Temperature (\xB0C)");

        //Draw Constant Relative Humidity Lines
        function drawRHline(phi){
          var rhline = d3.line()
            .x(function(d){
              return xscale(d.x);
            })
            .y(function(d){
              return yscale((622*phi*d.y)/(101.325-phi*d.y));
            })
            .curve(d3.curveMonotoneX);

          svg.append("path")
              .datum(tp1)
              .attr("clip-path", "url(#chartclip)")
              .attr("class","rhline")
              .attr("d", rhline)
              .attr("id","RHline"+phi);

          svg.append("text")
              .append("textPath") //append a textPath to the text element
               .attr("xlink:href", "#RHline"+phi) //place the ID of the path here
               .style("text-anchor","middle") //place the text halfway on the arc
               .attr("font-size","8")
               .attr("startOffset", "30%")
               .text("RH: "+Math.round(phi*100) +"%");
        }

        for (i=0.1;i<=1;i+=0.1){
          drawRHline(i);
        }

        //Draw Constant Specific Volume Lines
        function drawCSVLine(i){
          var csvline = d3.line()
           .x(function(d) {
             return xscale(d.x);
            })
           .y(function(d) {return yscale(d.y);})
           .curve(d3.curveMonotoneX);

          svg.append("path")
             .datum(tp2[i])
             .attr("clip-path", "url(#chartclip)")
             .attr("class","csvline")
             .attr("d", csvline);
        }

        for(i=0;i<7;i++){
          drawCSVLine(i);
        }

        //Draw Wet Bulb Temperature Lines
        function drawWBTLine(i){
          var wbtline = d3.line()
           .x(function(d) {
             return xscale(d.x);
            })
           .y(function(d) {return yscale(d.y);})
           .curve(d3.curveMonotoneX);

          svg.append("path")
             .datum(tp3[i])
             .attr("clip-path", "url(#chartclip)")
             .attr("class","wbtline")
             .attr("d", wbtline);
        }

        for(i=0;i<6;i++){
          drawWBTLine(i);
        }  

        //Draw Enthalpy Lines and Axis
        function drawENTLine(i){
          var entline = d3.line()
           .x(function(d) {
             return xscale(d.x);
            })
           .y(function(d) {return yscale(d.y);})
           .curve(d3.curveMonotoneX);

          svg.append("path")
             .datum(tp4[i])
             .attr("clip-path", "url(#chartclip)")
             .attr("class","entline")
             .attr("d", entline)
             .attr("id","ENTHline"+i);

             if(i<9 && i>0){
             svg.append("text")
                 .attr("rotate",180)
                 .append("textPath") //append a textPath to the text element
                  .attr("xlink:href", "#ENTHline"+i) //place the ID of the path here
                  .style("text-anchor","end") 
                  .attr("font-size","9")
                  .attr("startOffset", "99%")
                  .text("0"+(i+1));
             } else if(i==11){
              svg.append("text")
                 .append("textPath") //append a textPath to the text element
                  .attr("xlink:href", "#ENTHline"+i) //place the ID of the path here
                  .style("text-anchor","middle") 
                  .attr("font-size","12")
                  .attr("startOffset", "50%")
                  .text("Enthalpy (kJ/kg)");              
             }          

        }

        for(i=0;i<12;i++){
          drawENTLine(i);
        }  
}