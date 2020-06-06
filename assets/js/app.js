// @TODO: YOUR CODE HERE! 
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG chart base
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Load data from US Census .csv file
d3.csv("assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
  
    // Capture healthcare and poverty using a loop and convert to integer
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare
      data.poverty = +data.poverty
      console.log("Healthcare:", data.healthcare);
      console.log("Poverty:", data.poverty);
  });

    // Create x and y axis minimum and maximum points

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty), d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.healthcare), d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);


      
    // Create x and y axis functions
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add axes to chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  // Add tool tip to data points

      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Call tool tip in chart
    
    chartGroup.call(toolTip);

    // Create scatter plot circles including size and color
   
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

        // Show tool tip data when data point is clicked on chart
  
     .on("click", function(data) {
      toolTip.show(data, this);
     })
      // hide tool tip once you navigate away from data point
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create scatter plot circle labels that overlay the circles
    circlesGroup
      .append("text")
      .text(function(d) { return d.abbr; })
      .attr("dx", d => xLinearScale(d.poverty))
      // Center the state name in cell (10/2.5)
      .attr("dy", d => yLinearScale(d.healthcare) + 10/2.5)
      .attr("font-size", 10)
      .attr("class" , "stateText")

      // Show tool tip data when data point is clicked on chart
      .on("click", function(data) {
        toolTip.show(data, this);
      })
        // hide tool tip once you navigate away from data point
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });

 // Create axes labels
 chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 20 - margin.left)
  .attr("x", -60-(height / 2))

  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

chartGroup.append("text")
  .attr("transform", `translate(${-20 + width / 2}, ${height + 50})`)
  // .attr("y", 0 - margin.left)
  // .attr("x", 120-(height / 2))
  .attr("class", "axisText")
  .text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});
