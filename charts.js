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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    //Create a variable that holds the washing frequency.
    var wfreq = data.metadata.map(d=> d.wfreq);
    // 3. Create a variable that holds the samples array. 
     var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
     var resultarray = samples.filter(s => s.id == sample);
     console.log(resultarray);
    //  5. Create a variable that holds the first sample in the array.
     var firstSample = resultarray[0];
     console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Create variable to hold otu_ids.
     var otu_ids = (firstSample.otu_ids.slice(0,10)).reverse();
     console.log(otu_ids);
     
     // Create variable to hold otu_labels.
     var otu_labels = firstSample.otu_labels.slice(0,10);
     console.log(otu_labels);
    
    // Create variable to hold sample_values.
     var samplevalues = firstSample.sample_values.slice(0,10).reverse();
     console.log(samplevalues);
    
     // 7. Create the yticks for the bar chart.

    var yticks = otu_ids.map(otuID => "OTU" +" " + otuID );
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: samplevalues,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };
     
    // Create data variable
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis:{
        tickmode:"linear",
      }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var trace1 = {
    x: samples.otu_ids,
    y: samples.sample_values,
    mode: "markers",
    marker:{
      size: samples.sample_values,
      color: samples.otu_ids
    },
    text: samples.otu_labels
    };
    
    // Create data variable.
    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
    title: "Bacteria Cultures Per Sample"
    
     };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    
   });

    
};
