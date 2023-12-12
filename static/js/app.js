// Read in the JSON data from URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    console.log(data);
    console.log(data.metadata.filter(result=>result.id == 940)[0])


  });
// Create function for the demographic info box
function infoBox(sample){
    d3.json(url).then(function(data){
        // Assign all metadata to metaData
        let metaData = data.metadata;
        // Find the array of matching sample number to id
        let metaSampleMatch = metaData.filter(match => match.id == sample);
       
        // Access the data within the array
        let metaSampleData = metaSampleMatch[0];

        // clear the metadata out
        d3.select("#sample-metadata").html("");

        // Get the key/value pair and display in the info box
        Object.entries(metaSampleData).forEach(([key,value])=>{
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Create function for the bar chart of Top 10 OTUs found in that individual
function barChart(sample){
    d3.json(url).then(function(data){
        // Assign all samples to sampleData
        let sampleData = data.samples;
        // Find the array of matching sample number to id
        let sampleMatch = sampleData.filter(match=> match.id == sample);
        // Access the data within the array
        let matchData = sampleMatch[0];
        // Assign values to otu_ids, otu_labels, and sample_values
        let otu_ids = matchData.otu_ids;
        let otu_labels = matchData.otu_labels;
        let sample_values = matchData.sample_values;
        // Slice the first 10 (happens to be the top 10) OTUs for display
        let yTicks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);

        // Set up bar chart
        let barChart = {
            x: xValues.reverse(),
            y: yTicks.reverse(),
            text: textLabels.reverse(),
            type:"bar",
            orientation: "h"
        };
        // Set up the layout
        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };
        // Plot the bar chart
        Plotly.newPlot("bar",[barChart],layout)

    });
};

// Create function for the bubble chart
function bubbleChart(sample){
    d3.json(url).then(function(data){
        // Assign all samples to sampleData
        let sampleData = data.samples;
        // Find the array of matching sample number to id
        let sampleMatch = sampleData.filter(match=> match.id == sample);
        // Access the data within the array
        let matchData = sampleMatch[0];
        // Assign values to otu_ids, otu_labels, and sample_values
        let otu_ids = matchData.otu_ids;
        let otu_labels = matchData.otu_labels;
        let sample_values = matchData.sample_values;
        
        // Set up the bubble chart
        let bubbleChart = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "earth"
            },
            text: otu_labels
        };
        // Set up the layout
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID (Microbial Species Identification Number)"},
            yaxis: {title: "Amount Present In Culture"}
        };
        // Plot the bubble chart
        Plotly.newPlot("bubble", [bubbleChart],layout)
    });

};

// -------------------------------------- GAUGE CHART ATTEMPT 1 -----------------------------------
// Create function for gauge chart 
function gaugeChart(sample){
    d3.json(url).then(function(data){
     // Assign all metadata to metaData
     let metaData = data.metadata;
     // Find the array of matching sample number to id
     let metaSampleMatch = metaData.filter(match => match.id == sample);
     // Access the data within the array
     let metaSampleData = metaSampleMatch[0];
     // Get the key/value pair of wfreq
     let wfreq = Object.values(metaSampleData)[6];

     // Set up the gauge chart
     let gaugeChart = {
        domain: {x:[0,1],y:[0,1]},
        value: wfreq,
        title: {
            text: "<b>Belly Botton Washing Frequency</b><br>Scrubs per Week",
            font: {color: "black", size:16}
        },
        type: "indicator",
        mode: "gauge",
        gauge: {
            axis: {range: [0,10], tickmode:"linear",tick0:2,dtick:2},
            bar:{color:"darkred"},
            steps:[
                {range:[0,1], color:"floralwhite"},
                {range:[1,2], color:"cornsilk"},
                {range:[2,3], color:"beige"},
                {range:[3,4], color:"lightgoldenrodyellow"},
                {range:[4,5], color:"slimegreen"},
                {range:[5,6], color:"avocado"},
                {range:[6,7], color:"grass"},
                {range:[7,8], color:"darkseagreen"},
                {range:[8,9], color:"green"},
            ]
        }    
     };

     // Set up layout

     let layout = {
        width:400,
        height:400,
        margin:{t:3,b:0}
     };
     // Plot the gauge chart
     Plotly.newPlot("gauge",[gaugeChart],layout);
  });
};

// --------------------------------------------- GAUGE CHART ATTEMPT 2 ------------------------------------------------
// Enter a speed between 0 and 180
// function gaugeChart(sample){
//     d3.json(url).then(function(data){
//         // Assign all metadata to metaData
//         let metaData = data.metadata;
//         // Find the array of matching sample number to id
//         let metaSampleMatch = metaData.filter(match => match.id == sample);
//         // Access the data within the array
//         let metaSampleData = metaSampleMatch[0];
//         // Get the key/value pair of wfreq
//         let wfreq = Object.values(metaSampleData)[6];

//         var level = 20;

//         // Trig to calc meter point
//         function gaugePointer(wfreq){	
//             var degrees = 180 - wfreq*20,
//             radius = .5;
//             var radians = degrees * Math.PI / 180;
//             var x = radius * Math.cos(radians);
//             var y = radius * Math.sin(radians);

//         // Path: may have to change to create a better triangle
//             var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
//             pathX = String(x),
//             space = ' ',
//             pathY = String(y),
//             pathEnd = ' Z';
//             var path = mainPath.concat(pathX,space,pathY,pathEnd);
//             return path;
//         }

//         var data = [{ type: 'scatter',
//         x: [0], y:[0],
//             marker: {size: 18, color:'850000'},
//             showlegend: false,
//             name: 'speed',
//             text: level,
//             hoverinfo: 'text+name'},
//         { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
//         rotation: 90,
//         text: ['0-1', '1-2', '2-3', '3-4',
//                     '4-5', '5-6', '6-7'],
//         textinfo: 'text',
//         textposition:'inside',	  
//         marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                                 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                                 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                                 'rgba(255, 255, 255, 0)']},
//         labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//         hoverinfo: 'label',
//         hole: .5,
//         type: 'pie',
//         showlegend: false
//         }];

//         var layout = {
//         shapes:[{
//             type: 'path',
//             path: gaugePointer(sample),
//             fillcolor: '850000',
//             line: {
//                 color: '850000'
//             }
//             }],
//         //title: '<b>Gauge</b> <br> Speed 0-100',
//             autosize:true,
//         //height: 1000,
//         //width: 1000,
//         xaxis: {zeroline:false, showticklabels:false,
//                     showgrid: false, range: [-1, 1]},
//         yaxis: {zeroline:false, showticklabels:false,
//                     showgrid: false, range: [-1, 1]}
//         };

//         Plotly.newPlot('gauge', data, layout);
//     });
// };





// Create function to initialize the default dashboard

// -------------------------Attempt 3 -----------------------------
function gaugeChart(sample){
    d3.json(url).then(function(data){
     // Assign all metadata to metaData
     let metaData = data.metadata;
     // Find the array of matching sample number to id
     let metaSampleMatch = metaData.filter(match => match.id == sample);
     // Access the data within the array
     let metaSampleData = metaSampleMatch[0];
     // Get the key/value pair of wfreq
     let wfreq = Object.values(metaSampleData)[6];
     
     let gaugeChart = {
        type: "gauge",
        yAxis:{
            scale_range:[0,9]
        },
        series:{
            points: {
                y: wfreq,
                z: 0.8
         }
        }
    }










function init(){
    let select = d3.select("#selDataset");
    // Find the sample names 
    d3.json(url).then(function(data){
        let sampleNames = data.names;
        sampleNames.forEach((sample)=>{
            select.append("option").text(sample).property("value",sample);
        });
        // default sample
        let sample0 = sampleNames[0];
        infoBox(sample0);
        barChart(sample0);
        bubbleChart(sample0);
        gaugeChart(sample0);
    })
};

// Create function to update the dashboard
function optionChanged(item)
{
     // call the function to build the demographics box
    infoBox(item);

    // call the function to build the bar chart
    barChart(item);

    // call the function to build the bubble chart
    bubbleChart(item);

    // call the function to build the gauge chart
    gaugeChart(item);
}

// call the initialize function
init();
