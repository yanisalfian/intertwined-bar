var numbers = [18, 22, 18];
var barHeight = 40;
var barBottomMargin = 10;
var startX = 50;
var mainSvg, mainBar;
var charWidth = 490
var xAxisWidth = 50
var width = charWidth - startX - barHeight - xAxisWidth;
var colors = [
  ['#00897B', '#26A69A'],
  ['#1E88E5', '#42A5F5'],
  ['#00ACC1', '#26C6DA'],
  ['#43A047', '#66BB6A'],
  ['#FB8C00', '#FFA726'],
  ['#5E35B1', '#7E57C2'],
  ['#D81B60', '#EC407A'],
  ['#C0CA33', '#D4E157'],
  ['#6D4C41', '#8D6E63'],
  ['#546E7A', '#78909C'],
]

function onload() {
  d3.select("#thebar").attr('width', charWidth).attr('height', 3 * (barHeight + barBottomMargin))
  initialRenderChart();
}

/* Components builder functions  --start */
function getColorSchema(i){
  return colors[i % 10]
}

function createIntertwinedPath(i) {
  var beforeLast = i === numbers.length - 2;
  var last = i === numbers.length - 1;

  if (beforeLast) {
    var path = d3.path();
    path.moveTo(0, i * (barHeight + barBottomMargin) - 15);
    path.quadraticCurveTo(
      startX / 1.7,
      (i + 1) * (barHeight + barBottomMargin),
      startX + 1,
      (i + 1) * (barHeight + barBottomMargin)
    );
    path.lineTo(startX + 1, (i + 1) * (barHeight + barBottomMargin) + 40);
    path.quadraticCurveTo(
      startX / 2.3,
      (i + 1) * (barHeight + barBottomMargin) + barHeight - 1,
      0,
      i * (barHeight + barBottomMargin) + barHeight + barBottomMargin
    );
  } else if (last) {
    var path = d3.path();
    path.moveTo(0, (i - 1) * (barHeight + barBottomMargin) + 20);
    path.quadraticCurveTo(
      startX / 2,
      (i - 1) * (barHeight + barBottomMargin),
      startX + 1,
      (i - 1) * (barHeight + barBottomMargin)
    );
    path.lineTo(startX + 1, (i - 1) * (barHeight + barBottomMargin) + 40);
    path.quadraticCurveTo(
      startX / 1.7,
      (i - 1) * (barHeight + barBottomMargin) + barHeight - 1,
      0,
      (i - 1) * (barHeight + barBottomMargin) + barHeight + 20
    );
  } else {
    var path = d3.path();
    path.moveTo(0, i * (barHeight + barBottomMargin) + 20);
    path.quadraticCurveTo(
      startX / 2,
      i * (barHeight + barBottomMargin),
      startX + 1,
      i * (barHeight + barBottomMargin)
    );
    path.lineTo(startX + 1, i * (barHeight + barBottomMargin) + 40);
    path.quadraticCurveTo(
      startX / 1.7,
      i * (barHeight + barBottomMargin) + barHeight - 1,
      0,
      i * (barHeight + barBottomMargin) + barHeight + 20
    );
  }
  return path;
}

function addIntetwinedPath(d, i){
  d3.select('#thebar').append("path")
    .attr('class', 'the-path')
    .attr("d", createIntertwinedPath(i))
    .attr("stroke-width", 0)
    .attr("fill", () => {
      if (i === numbers.length - 1) {
        return getColorSchema(i - 1)[0];
      } else if (i === numbers.length - 2) {
        return getColorSchema(i + 1)[0];
      } else {
        return getColorSchema(i)[0];
      }
    });
}

function addMainBar(d,i){
  var colors = getColorSchema(i)
  //add lineargradient
  var grad = d3.select('#thebar').select('defs')
    .append('linearGradient')
    .attr('id', 'grad-' + i)
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');

  grad.selectAll('stop')
    .data(colors)
    .enter()
    .append('stop')
    .style('stop-color', function(d){ return d; })
    .attr('offset', function(d,i){
      return 100 * (i / (colors.length - 1)) + '%';
    })
  
  d3.select('#thebar').append('rect')
    .attr("width", barHeight)
    .attr("height", barHeight)
    .attr(
      "transform",
        "translate(" + startX + ", " + i * (barHeight + barBottomMargin) + ")"
    )
    .attr("fill", 'url(#grad-'+i+')')
    .attr("id", 'mainBar'+i)
    .transition()
    .duration(1000)
    .attr("width", (d / 100) * width + barHeight);
}

function addXLabel(d, i){
  d3.select('#thebar').append("text")
    .attr('id', 'xaxis-' + i)
    .attr("x", width + barHeight + 10 )
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .attr(
      "transform",
        "translate(" + startX + ", " + i * (barHeight + barBottomMargin) + ")"
    )
    .attr("class", "right-label")
    .attr('width', xAxisWidth)
    .text("No." + (i + 1));
}

function addCircle(d, i){
  d3.select('#thebar').append("circle")
    .attr('id', 'circle-' + i)
    .attr("cx", startX + (barHeight / 4))
    .attr("cy", i * (barHeight + barBottomMargin) + (barHeight / 2))
    .attr("r", "15px")
    .attr("fill", "white")
    .transition()
    .duration(1000)
    .attr("cx", (d / 100) * width + (barHeight/2) + startX);
}

function addPercentage(d,i){
  d3.select('#thebar').append("text")
    .attr('id', 'percent-' + i)
    .attr("x", 0)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .attr(
      "transform",
        "translate(" + startX + ", " + i * (barHeight + barBottomMargin) + ")"
    )
    .attr("class", "right-label")
    .text(d + "%")
    .transition()
    .duration(1000)
    .attr("x", (d / 100) * width + 10)
    .tween("text", function (d1) {
      var i = d3.interpolateRound(0, d);
      return function (t) {
        this.textContent = Math.round(i(t)) + "%";
      };
    });
}
/** Component builde function --end */

function resizeChartHeight(){
  d3.select('#thebar').attr('height', numbers.length * (barHeight + barBottomMargin))
}

function initialRenderChart() {
  d3.select('#thebar').append('defs')
  for (let i = 0; i < numbers.length; i++) {
    const d = numbers[i];
    addIntetwinedPath(d, i)
    addXLabel(d, i);
    addMainBar(d, i);
    addCircle(d, i)
    addPercentage(d, i)
  }
}

function updateChart(){
  for (let i = 0; i < numbers.length; i++) {
    const d = numbers[i];
    d3.select('#mainBar' + i)
      .transition()
      .duration(1000)
      .attr("width", (d / 100) * width + barHeight);
    
    d3.select('#circle-' + i)
      .transition()
      .duration(1000)
      .attr("cx", (d / 100) * width + (barHeight/2) + startX);

    d3.select('#percent-' + i)
      .transition()
      .duration(1000)
      .attr("x", (d / 100) * width + 10)
      .tween("text", function (d1) {
        var i = d3.interpolateRound(parseInt(this.textContent.replace('%', '')), d);
        return function (t) {
          this.textContent = Math.round(i(t)) + "%";
        };
      });
  }
}

function addDataToChart(){
  const i = numbers.length - 1
  const d = numbers[i]

  //update chart height
  resizeChartHeight()
  
  //update interwined paths
  d3.selectAll('.the-path').remove()
  for (let i = 0; i < numbers.length; i++) {
    const d = numbers[i];
    addIntetwinedPath(d, i)
  }
  
  //add No. text
  addXLabel(d, i)
  //add bar
  addMainBar(d, i)
  //add circle
  addCircle(d, i)
  //add percentage
  addPercentage(d, i)
}

function removeFromChart(){
  const i = numbers.length

  //update chart height
  resizeChartHeight()

  //rebuild intertwined paths
  d3.selectAll('.the-path').remove()
  for (let i = 0; i < numbers.length; i++) {
    const d = numbers[i];
    addIntetwinedPath(d, i)
  }
  
  //remove last bar 
  d3.select('#mainBar' + i).remove()
  d3.select('#grad-' + i).remove()
  //remove last x axis label
  d3.select('#xaxis-' + i).remove()
  //remove last circle
  d3.select('#circle-' + i).remove()
  //remove last percentage
  d3.select('#percent-' + i).remove()
}

function randomize(){
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = Math.floor(Math.random() * 100)
  }
  updateChart()
}

function addData(){
  numbers.push(Math.floor(Math.random() * 100))
  addDataToChart()
}

function reduceData(){
  if(numbers.length == 2){
    alert('You have reached the limit to reduce data')
  } else {
    numbers.pop()
    removeFromChart()
  }
}
