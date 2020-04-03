
document.addEventListener('DOMContentLoaded', () =>{
    
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
            .then(response => response.json())
            .then(data => {
        createChart(data.data)
            })
})
    

const createChart = (dataset) =>{  
    
    
    let dataPoint = dataset.map(d => d[1]);
    let quarterTime = dataset.map(d => {
        let quarter = '';
        let month = d[0].substr(5,2);
        switch (month){
            case '01': 
                quarter = 'Q1';
                break;
            case '04':
                quarter = 'Q2';
                break;
            case '07':
                quarter = 'Q3';
                break;
            case '10':
                quarter = 'Q4';
                break;
            default: 
                break;
        }
                return quarter + ' ' + d[0].substr(0,4);
    });
    const year = dataset.map(d => d[0].substr(0,4))
    
    const StringToDate = dataset.map(d => new Date(d[0]))
    
    
    const w = 900, h = 450;
    const padding = 50;
    
    const horizontalMax = d3.max(StringToDate);
    const horizontalMin = d3.min(StringToDate);
    const verticalMax = d3.max(dataPoint);
    const xScale = d3.scaleLinear()
                    .domain([horizontalMin,horizontalMax])
                    .range([padding, w])
                    
    
     const xScaleAxis = d3.scaleLinear()
                    .domain([d3.min(year),d3.max(year)])
                    .range([padding, w])
    
    const yScale = d3.scaleLinear()
                    .domain([0, verticalMax])
                    .range([0, h-padding]) 
    
    const yScaleAxis = d3.scaleLinear()
                    .domain([0, verticalMax])
                    .range([h-padding, 0])
    
    const xAxis = d3.axisBottom(xScaleAxis).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScaleAxis);
    const tooltip = d3.select('#svgContainer')
                        .append('div')
                        .attr('id','tooltip')
                        .attr('style','opacity: 0')
                        .attr('class','align-center')
                       
    const svg = d3.select("#svgContainer")
                  .append("svg")
                  .attr("width", w+padding)
                  .attr("height", h+padding)
                  
    
    svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(StringToDate[i]))
            .attr('y', (d,i) => h-yScale(dataPoint[i]))
            .attr('width',w/(dataset.length))
            .attr('height', (d,i) => yScale(dataPoint[i]))
            .attr('class', 'bar')
            .attr('data-date', (d,i)=>dataset[i][0])
            .attr('data-gdp', (d,i)=>dataset[i][1])
            .on('mouseover', (d,i)=>{
                tooltip.attr('style', 'transform: translate(' + ( 40+xScale(StringToDate[i])) + 'px,' + (h-100) + 'px)')  
                        .html(quarterTime[i] + '<br>' + '$' + dataPoint[i] + ' Billion')
                        .attr('data-date', dataset[i][0])
                        
                    
            })
            
            .on('mouseout',(d,i)=>{
                
                tooltip.attr('style', 'transform: translate(' + ( 40+xScale(StringToDate[i])) + 'px,' + (h-100) + 'px)')  
                 
                    .attr('style','opacity: 0')
    })  
            
    svg.append('g')
        .attr('transform', 'translate(0, ' + h + ")")
        .attr('id','x-axis')
        .call(xAxis)
    
    svg.append('g')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')
        .attr('id','y-axis')
        .call(yAxis)
}