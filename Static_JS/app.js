// app.js - Belly Button Biodiversity Dashboard

// -- HELPER FUNCTIONS --
// ----------------------

// ACTIVATE LOADER
function showLoader(target_id = '#loader') {
  d3.select(target_id).classed('d-none', false);
};

// DEACTIVATE LOADER
function hideLoader(target_id = '#loader') {
  d3.select(target_id).classed('d-none', true);
};

// LABEL CLEANER
function cleanLabels(dirty_arr) {
  let clean_arr = [];
  for (let label_set of dirty_arr) {
    clean_arr.push(label_set.replace(/;/g, '<br>'));
  }
  return clean_arr;
};

// LOCATION CLEANER
function cleanLocation(location) {
  return null;
}

// RECORD COUNTS WARNINGS
function displayWarnings(total, numberToShow, alert_id) {
  // d3 select html targets
  let alert = d3.select(alert_id);
  let id = d3.select('#selDataset').node().value;

  // Clear out existing html if any
  alert.html('');

  // Set vars for easy writing
  const divDanger = '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
  const divWarning = '<div class="alert alert-warning alert-dismissible fade show" role="alert">';
  const divInfo = '<div class="alert alert-info alert-dismissible fade show" role="alert">';
  const closeBtn = '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

  let message = '';
  // Checking for small # of records -> Display #s
  if (total == 0) {
    message = `
      ${divDanger}
        DANGER: SUBJECT HAS ${total} RECORDS TO DISPLAY!
        ${closeBtn}
      </div>
    `;
  }
  else if (total == 1) {
    message = `
      ${divWarning}
        WARNING: SUBJECT ${id} ONLY HAS ${total} RECORD! (< 10)
        ${closeBtn}
      </div>
    `;
  }
  else if (total < 10) {
    message = `
      ${divWarning}
        WARNING: SUBJECT ${id} ONLY HAS ${total} RECORDS! (< 10)
        ${closeBtn}
      </div>
    `;
  }
  else if (total < 20) {
    message = `
      ${divInfo}
        Info: Subject ${id} only has ${total} records. (< 20)<br>
        ${closeBtn}
      </div>
    `;
  }
  
  // Checking against selection for bar-chart limit
  if (numberToShow > total) {
    message = `
      ${divWarning}
        Input Error: You've request ${numberToShow} bars, but there are only ${total} data points.<br>
        Showing all available data.
        ${closeBtn}
      </div>
    `;
  }

  alert.html(message);

  return null;
}

// -- CHART TRACERS --
// -------------------

// BUBBLE CHART BUILD
function bubbleChart(json, params) {
  // Build a Bubble Chart
  // No modification of original array occuring - So no copy is needed
  let trace = {
    x: json.otu_ids,
    y: json.sample_values,
    mode: 'markers',
    marker: {
      size: json.sample_values,
      color: json.otu_ids,
      colorscale: 'Viridis'
    },
    hovertext: cleanLabels(json.otu_labels),
    hovertemplate:
      'ID #: <b>%{x}</b><br>' +
      'Count: <b>%{y}</b><br>' +
      '-----------------<br>' +
      '%{hovertext}' +
      '<extra></extra>'
  };

  // Build Bubble Chart Layout
  let layout = {
    title: {
      text: 'Bacteria Cultures Per Sample',
      font: {size: 22}
    },
    xaxis: {
      title: {
        text: 'OTU ID',
        font: {size: 19}
      }
    },
    yaxis: {
      title: {
        text: 'Number of Bacteria',
        font: {size: 19},
      }
    },
    hoverlabel: {font: {size: 15}}
  };

  // Render the Bubble Chart
  Plotly.newPlot('bubble', [trace], layout, params);

  return null;
};

// BAR CHART BUILD
function barChart(json, params) {
  // Get the otu_ids, otu_labels, and sample_values
  let ids = json.otu_ids;
  let values = json.sample_values;
  let labels = json.otu_labels;

  // Getting user input value
  let userVal = d3.select('#barLimit').node().value;

  // Getting Universal Length
  let _length = ids.length;

  // Find slicing limit
  let limit;
  if (userVal == 'all')
    limit = _length;
  else
    limit = Number(userVal) || 10;

  // Display warnings if any
  // (Multiple subjects has less than 10 records)
  displayWarnings(_length, limit, '#alert-box');

  // Capping limit for proper displaying of max data limits
  // Now if a limit greater than the length is requested the 
  //    the length is shown instead (along with the text title)
  //    as though 'All' was selected
  if (limit > _length) limit = _length;

  // Format Arrays for Barchart
  // Slicing for Top 10 OTU Values (Plotly pre-sorts) w/ rearrangement &
  // mapping IDs to string & matching value axis
  let slicedValues = values.slice(0, limit);
  let slicedIDs = ids.slice(0, limit).map(id => `OTU ${id}`);
  let slicedLabels = labels.slice(0, limit);

  // Reverse arrays in place
  slicedIDs.reverse();
  slicedValues.reverse();
  slicedLabels.reverse();

  // Build a Bar Chart
  let trace = {
    x: slicedValues,
    y: slicedIDs,
    type: 'bar',
    orientation: 'h',
    hovertext: cleanLabels(slicedLabels),
    hovertemplate: 
      'Count: <b>%{x}</b><br>' +
      '---------------<br>' +
      '%{hovertext}' +
      '<extra></extra>'
  };
  
  // Cond'l Title Text
  let titleText = '';
  if (limit == _length)
    titleText = `All ${limit} Bacteria Cultures Found`;
  else
    titleText = `Top ${limit} Bacteria Cultures Found`;

  // Build Bar Chart Layout
  let layout = {
    title: {
      text: titleText,
      font: {size: 22}
    },
    xaxis: {
      title: {
        text: 'Number of Bacteria',
        font: {size: 19}
      },
      fixedrange: true // Non-zoomable
    },
    yaxis: {
      fixedrange: true  // Non-zoomable
    },
    dragmode: false,  // Non-draggable
    hoverlabel: {   // Custom tooltip
      bgcolor: 'rgb(200, 255, 255)',
      font: {size: 15.5}
    }
  };
  
  // Render the Bar Chart
  Plotly.newPlot('bar', [trace], layout, params);

  return null;
};


// -- Page Builders -- 
// -------------------

// DROPDOWN BUILDER
function buildDropDown(arr2D, target_id) {
  // Use d3 to select the dropdown with id of `#selDataset`
  let dropDown = d3.select(target_id);
  // Clear (if existing) any html
  dropDown.html('');

  // Create Doc Fragment to Hold Option Elements
  // (Approach of appending to the DOM only once was taken)
  let frag = document.createDocumentFragment();

  // For each name create an option element with that name
  // Append each one to the doc fragment
  for (let item of arr2D) {
    let opt = document.createElement('option');
    opt.value = item[0];
    opt.text = item[1];

    // Check for default selection
    if (item[2]) opt.setAttribute(item[2], true);

    // Append each option to fragment
    frag.appendChild(opt);
  };

  // Append the whole document fragment to the dropdown menu
  dropDown.node().appendChild(frag);

  return null;
};

// METADATA PANEL BUILD
function buildMetadata(sampleNum, json) {
  // Get the metadata field
  let metadata = json.metadata;

  // Filter the metadata for the object with the desired sample number
  metadata = metadata.filter(entry => {
    if (entry.id == sampleNum) return entry;
  });
  metadata = metadata[0];

  // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  panel.html('');

  // Edge case: user typed or selected an invalid ID
  if (!metadata) {
    panel.html(`
      <div class="alert alert-danger" role="alert">
        No matching subject ID found!
      </div>
    `);
    return null;
  };

  // Inside a loop, append new elements to doc frag with
  // tags for each key-value in the filtered metadata.
  let frag = document.createDocumentFragment();
  
  for(let [key, value] of Object.entries(metadata)) {
    // Create an empty span for each key and value
    let key_span = document.createElement('span');
    let val_span = document.createElement('span');
    
    key = key.toLowerCase();
    if (value) {
      if (key == 'gender') {
        value = value.toUpperCase();
      }
      else if (key == 'location') {
        if (value.length > 2) {
          value = value.replace(/[\s,/]/g, ', ')
            .replace(/([\.a-z])([A-Z])/, '$1 $2')
            .replace(/(?<!,)(?:\s)([A-Z]{2})$/, ', $1');
        }
      }
      else if (key == 'bbtype') {
        if ( /i/i.test(value) ) value = 'Innie'
        else if ( /o/i.test(value) ) value = 'Outie';
      }
    }
    else {
      value = 'N/A';
    };

    key_span.id = key;
    key_span.textContent = key.toUpperCase() + ': ';
    key_span.setAttribute('value', value);
    val_span.textContent = value;

    frag.appendChild(key_span).appendChild(val_span);
    frag.appendChild(document.createElement('br'));

    
  };
  panel.node().appendChild(frag);


  return null;
};

// MAIN CHART BUILDER
function buildCharts(sampleNum, json) {
  // Get the samples field
  let sample = json.samples;

  // Filter the samples for the object with the desired sample number
  sample = sample.filter(entry => {
    if (entry.id == sampleNum) return entry;
  });
  sample = sample[0];

  // No matching sample, handle gracefully
  if (!sample) {
    Plotly.newPlot('bar', [], {});
    Plotly.newPlot('bubble', [], {});
    return null;
  };

  // Additional Parameters
  let params = {
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  };

  barChart(sample, params);
  bubbleChart(sample, params);

  return null;
};


// -- Page Core --
// ---------------

// Init. Global Var to Hold JSON
let globalJSON = null;

// Function to run on page load
function init() {
  // Show loader while page loads
  showLoader();

  // Core API, metadata, and chart building call
  const json_api = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'; 
  d3.json(json_api).then(data => 
    {
      // Store Full JSON for rebuilding plot later
      globalJSON = data;
      
      // Get the names field
      let names = data.names;

      // Build DropDown Menus
      // --------------------
      // Use the list of sample names and alg. calculated array to populate `select`
      // Using user defined function requires populating in 2 dimensional array
      let names_2d = names.map(name => [name, name]);
      buildDropDown(names_2d, '#selDataset');
      
      // Building option tab for bar chart limit (dropdown)
      // Building in 2D for [values, text] to be displayed
      let options = [5, 10, 15, 20, 25, 30];
      options = options.map(opt => [opt, `Top ${opt}`]);
      options.push(['all', 'All']);
      options[1].push('selected');
      buildDropDown(options, '#barLimit');

      // Get the first sample from the list
      let firstSample = names[0];

      // Build charts and metadata panel with the first sample
      buildMetadata(firstSample, data);
      buildCharts(firstSample, data);
      
      // Hide loader now that everything is finished
      hideLoader();
    }
  );
  return 0;
};

// -- EVENT LISTENERS -- 
// ---------------------

// Event when changing the subject ID selection
function sampleChange(newSampleNum) {
  // Utilize loader functions again
  showLoader();

  // Build charts and metadata panel each time a new sample is selected
  // Use globally stored JSON instead of making another API call
  buildMetadata(newSampleNum, globalJSON);
  buildCharts(newSampleNum, globalJSON);
  hideLoader();
};

// Event when hitting the random subject ID button
function randomSelect() {
  // Randomly select index from array
  let ids = globalJSON.names;
  let rand = ids[Math.floor(Math.random() * ids.length)];
  
  // Call page builder for new option selection
  sampleChange(rand);

  // Set Dropdown select value to random ID
  d3.select('#selDataset').property('value', rand);

  return null;
};

// Event Helper Function to return current color scheme
function getCurrentColor(selection, colors) {
  // Compare each arr element to find the old colors
  for (let colorScheme of colors) {
    let tokens = colorScheme.split(' ');
    if (tokens.every(token => selection.classed(token))) {
      return colorScheme;
    };
  };
};

// Event to change colors on certain pressables
function colorChange(element) {
  // Set list of colors (in bootstrap)
  let colors = [
    'bg-success text-white',
    'bg-primary text-white',
    'bg-danger text-white',
    'bg-warning',
    'bg-info',
    'bg-secondary text-white',
    'bg-light',
    'bg-dark text-white'
  ];
  let selection = d3.select(element);

  // Randomly select a color and then ensure it's new
  let oldColor = getCurrentColor(selection, colors);
  let newColor = '';
  do {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  } while (newColor == oldColor);

  // Grab all linked color elements
  let links = d3.selectAll('.linked-color');

  // Modify each one
  links.each(function() {
      // Select current element
      let sel = d3.select(this);

      // Remove old colors
      for (let colorSchema of colors) {
        for (let token of colorSchema.split(' ')) {
          sel.classed(token, false);
        };
      };
      // Add new colors
      for (let token of newColor.split(' ')) {
        sel.classed(token, true);
      };
    }
  );

  return null;
};


// Initialize the dashboard
init();