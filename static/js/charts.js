function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
     var samples = data.samples;
    
     // Create a variable that filters the samples for the object with the desired sample number.
     var resultarray = samples.filter(s => s.id == sample);
     console.log(resultarray);
    
     // Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter(m => m.id == sample);
    console.log(metaArray);
    
    // Create a variable that holds the first sample in the array.
     var firstSample = resultarray[0];
     console.log(firstSample);
     
    // Create a variable that holds the first sample in the metadata array.
    var metaSample = metaArray[0];
    console.log(metaSample);
 
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Create variable to hold otu_ids.
     var otu_ids = (firstSample.otu_ids.slice(0,10)).reverse();
     console.log(otu_ids);
     
     // Create variable to hold otu_labels.
     var otu_labels = firstSample.otu_labels.slice(0,10);
     console.log(otu_labels);
    
    // Create variable to hold sample_values.
     var samplevalues = firstSample.sample_values.slice(0,10).reverse();
     console.log(samplevalues);
    
    // Create a variable that holds the washing frequency.
    var wfreq = metaSample.wfreq;

    // Create the yticks for the bar chart.
    var yticks = otu_ids.map(otuID => "OTU" +" " + otuID );
    console.log(yticks);

    // Create the trace for the bar chart. 
    var trace = {
      x: samplevalues,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };
     
    // Create data variable
    var barData = [trace];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis:{
        tickmode:"linear",
      }, 
      height: 500,
      width: 500,
     
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // Create the trace for the bubble chart.
    var trace1 = {
    x: firstSample.otu_ids,
    y: firstSample.sample_values,
    mode: "markers",
    marker:{
      size: firstSample.sample_values,
      color: firstSample.otu_ids
    },
    text: firstSample.otu_labels
    };
    
    // Create data variable.
    var bubbleData = [trace1];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title: "OTU ID" },
    height: 600,
    width: 1200
    
     };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    //  Create the trace for the gauge chart.
    var trace3 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: parseFloat (wfreq),
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {axis: { range: [0, 10] },
              steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lime" },
              { range: [8, 10], color: "green" },
              ]}
  
      };
       
      
    // Create data variable.
    var gaugeData = [trace3];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 600, 
      margin: { t: 0, b: 0 } 
    };
     
    

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    
   });

    
};
