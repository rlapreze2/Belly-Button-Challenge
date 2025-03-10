# belly-button-challenge
Module 14 Challenge

Welcome to the Belly Button Biodiversity Dashboard GitHub repository! This project visualizes the bacterial data from human navels using interactive charts built with Plotly.

## Overview

This dashboard is designed to explore and visualize the microbial species (also known as Operational Taxonomic Units, or OTUs) that are present in human navels. The project uses JavaScript, D3.js, and Plotly.js to render interactive visualizations.

## Repository Structure

- **index.html**: The main HTML document.
- **static/js/app-lapreze.js**: Contains JavaScript code for fetching data and building visualizations.

## How It Works

### 1. Initialize Dashboard

The `init()` function initializes the dashboard by populating the dropdown menu and setting up the initial visualizations.

### 2. Build Metadata Panel

The `buildMetadata(sample)` function processes and displays demographic information:

- **Fetch Data**: Uses `d3.json(URL)` to retrieve data.
- **Extract Metadata**: Filters metadata for the selected sample.
- **Display**: Appends metadata to the demographics panel as paragraphs.

![Demographic Information](images/demo_info.png)<br>
*Figure 1: Demographic Information Panel displaying selected sample’s metadata, providing insights into the diversity and characteristics of the microbial communities present.*

### 3. Build Bar Chart

The `buildBarChart(sample)` function creates a bar chart of the top 10 OTUs found in the selected sample:

- **Data Preparation**: Fetches data, filters by sample ID, and prepares data for plotting.
- **Plotly Rendering**: Configures and renders the bar chart using Plotly.
```html
HTML element required:
<div id="bar"></div>
```

![Bar Chart](images/bar_chart.png)<br>
*Figure 2: Bar chart visualization showing the top 10 Operational Taxonomic Units (OTUs) identified in the selected sample.*

### 4. Build Bubble Chart

The `buildBubbleChart(sample)` follows a similar process to the bar chart but visualizes data in a bubble chart format:

- **Marker Setup**: Configures the appearance of bubbles based on sample values.
- **Plotly Rendering**: Uses Plotly to plot the bubble chart.
```html
HTML element required:
<div id="bubble"></div>
```

![Bubble Chart](images/bubble_chart.png)<br>
*Figure 3: Bubble chart visualization depicting the distribution and abundance of microbial species across different samples. Each bubble’s size is proportional to the frequency of the OTUs.*

### 5. Event Listener for Dropdown Changes

Changes in the dropdown menu invoke the `optionChanged(sample)` function directly from HTML:
```html
<select id="selDataset" onchange="optionChanged(this.value)"></select>
```

![Dropdown Menu](images/dropdown_menu.png)<br>
*Figure 4: Dropdown menu for selecting a sample ID, triggering updates across all visualizations on the dashboard.*

## Learn More

To learn more about how to enable GitHub Pages, watch [this tutorial on YouTube](https://www.youtube.com/watch?v=DqjPr7auwdY).

---

Thank you for visiting the Belly Button Biodiversity Dashboard repository!

This README file provides a comprehensive overview of the project, how each part of the code works, and how to use the project.