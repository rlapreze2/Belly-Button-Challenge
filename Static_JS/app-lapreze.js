// Belly Button Biodiversity Dashboard
document.body.style.backgroundColor = 'white';

// Place url in a constant variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up
function init() {
    d3.json(url).then(data => {
        
        // Populate the dropdown menu
        let names = data.names;
        let dropdownMenu = d3.select("#selDataset");

        // Add samples to the dropdown menu
        names.forEach(id => {

            // Log the value of each id for each iteration of the loop
            console.log(id);

            // Append a new option to the dropdown menu
            dropdownMenu.append("option")

            // Sets the visible text in the dropdown menu
            .text(id)

            // Sets the value attribute of the <option> element
            .property("value", id);
        });

        // Extract the first sample element
        let firstSample = names[0];

        // Log the value of firstSample
        console.log(firstSample);

        // Build the initial plots
        buildMetadata(firstSample);
        buildBarChart(firstSample);
        buildBubbleChart(firstSample);
    });
};

// Build the demographics (metadata) panel
function buildMetadata(sample) {
    
    // Fetch the JSON data
    d3.json(url).then((data) => {
        
        // get the metadata field
        let metadata = data.metadata;
        
        // Filter the metadata for the object with the desired sample number
        let filteredData = metadata.filter(obj => obj.id == sample);

        // Assign the first object to a variable
        result = filteredData[0];
        
        // Use d3 to select the panel with id of `#sample-metadata`
        let panel = d3.select("#sample-metadata");
        
        // Use `.html("") to clear any existing metadata
        panel.html("");

        // Object.entries() is a method in JavaScript used to return
        // an array of a given objects's own enumerable property [key, value] pairs
        let entries = Object.entries(result); // Access the first item in the array
        
        // Inside a loop, you will need to use d3 to append new
        // tags for each key-value in the filtered metadata.
        entries.forEach(([key, value]) => {

            // Append a h5 child element for each key-value pair
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries array
        console.log(entries);
    });
  }

// Build the bar chart
function buildBarChart(sample) {
    
    // Fetch the JSON data
    d3.json(url).then((data) => {
        
        // Get the samples field
        let samples = data.samples;
        
        // Filter the samples for the object with the desired sample number
        let filteredData = samples.filter(obj => obj.id == sample);

        // Assign the first object to a variable
        result = filteredData[0];
        
        // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        
        // Build a Bar Chart
        // Don't forget to slice and reverse the input data appropriately
        let trace = [{
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        let barLayout = {
            title: 'Top 10 Bacteria Cultures Found (OTUs)',
            margin: { t: 30, l: 150 } 
        }
        
        // Render the Bar Chart
        Plotly.newPlot('bar', trace, barLayout);
    });
  }

// Build the bubble chart
function buildBubbleChart(sample) {
    
    // Fetch the JSON data
    d3.json(url).then((data) => {
        
        // Get the samples field
        let samples = data.samples;
        
        // Filter the samples for the object with the desired sample number
        let filteredData = samples.filter(obj => obj.id == sample)
        
        // Assign the first object to a variable
        result = filteredData[0];
        
        // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Build a Bubble Chart
        let trace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }];
        
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' },
            height: 600
        };

        // Render the Bubble Chart
        Plotly.newPlot('bubble', trace, bubbleLayout)  
    });
  }

// Function for event listener (update the dashboard)
function optionChanged(sample) {
    
    // Build charts and metadata panel each time a new sample is selected
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
  }

// Call the initialize function to initialize the dashboard
init();