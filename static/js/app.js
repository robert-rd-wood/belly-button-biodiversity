function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sample) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      // Add <p> element containing the key and value
      metadata.append("p").text(key+": "+value);
    });
  
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sample) => {

    // @TODO: Build a Bubble Chart using the sample data

    // Build trace for bubble plot using data from sample object
    var trace1 = {
      type: "scatter",
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };

    // Define layout for bubble plot
    var layout = {
      xaxis: {
        autorange: true,
        title: "OTU ID"
      },
      yaxis: {
        autorange: true
      }
    };

    // Assign data variable for plotting
    var data=[trace1];

    // Draw bubble plot
    Plotly.newPlot("bubble",data,layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
