// @TODO: YOUR CODE HERE! 123
var svgWidth = 600;
var svgHeight = 600;

var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  // .append("toolTip")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
  
    // // log a list of names
    // var states = censusData.map(usState => usState.state);
    // console.log("states", states);
  
    // Cast each hours value in tvData as a number using the unary + operator
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare
      data.poverty = +data.poverty
      console.log("Healthcare:", data.healthcare);
      console.log("Poverty:", data.poverty);
  });

      // Step 2: Create scale functions
    // ==============================


    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty), d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.healthcare), d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);


      
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
  // Step 6: Initialize tool tip
    // ==============================
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty(%): ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()

    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", "0.8")
    // 
    

        // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    .on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    
    circlesGroup
      .append("text")
      .text(function(d) { return d.abbr; })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare) + 10 / 2.5)
      .attr("font-size", 10)
      .attr("class" , "stateText")

      .on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });




 // Create axes labels
 chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left + 40)
 .attr("x", 0-(height / 2))

 .attr("class", "axisText")
 .text("Lacks Healthcare (%)");

chartGroup.append("text")
 .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
 .attr("y", 0 - margin.left + 40)
 .attr("x", 0-(height / 2))
 .attr("class", "axisText")
 .text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});
