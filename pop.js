const margin = { top:40, right:30, bottom:20, left: 40 };
var width = 1200 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;

const svg = d3.select('.content')
                .append('svg')
                .attr('width', width +  margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

d3.csv("./data/WPP2022_Population_ByAge_5Group_Sex_Medium.csv")
    .then(data => {
        IndiaChinaData = data.filter(d => d['Location'] === 'India' || d['Location'] === 'China' );

        IndiaChinaData.forEach(d => {
                d.AgeGrp =  d.AgeGrp,
                d.Time = d.Time,
                d.PopMale = +d.PopMale,
                d.PopFemale = +d.PopFemale,
                d.PopTotal = +d.PopTotal
            });

        IndiaData_21 = IndiaChinaData.filter(d => d['Location'] === 'India' && d['Time'] === "2021");
        IndiaData_21.forEach(d => {
            d.PopMale = -1 * d.PopMale;
        })

        let popMinIndia = d3.min([d3.min(IndiaData_21, d => d["PopFemale"]), d3.min(IndiaData_21, d => d["PopMale"])]);
        let popMaxIndia = d3.max([d3.max(IndiaData_21, d => d["PopFemale"]), d3.max(IndiaData_21, d => d["PopMale"])]);

        let xScaleIndia = d3.scaleLinear()
                    .domain([popMinIndia, popMaxIndia])
                    .range([margin.left, (width/2)-margin.right]);
        
        let xAxisIndia = d3.axisBottom(xScaleIndia);

        let yValIndia = [];
        IndiaData_21.map(d => { return d["Time"] === "2021"? yValIndia.push(d["AgeGrp"]): '' });
        let yScaleIndia = d3.scaleBand()
                        .domain(yValIndia)
                        .range([height-margin.bottom, margin.top]);

        let yAxisIndia = d3.axisLeft(yScaleIndia);

        svg.append("g")
            .attr("class", "xAxisIndia")
            .attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
            .call(xAxisIndia)
            .call(g => g.select('.domain').remove())
            // .call(g => g.selectAll('line').remove())

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxisIndia)
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('line').remove())
        
        svg.selectAll(".popFemaleIndia")
            .data(IndiaData_21)
            .enter().append("rect")
            .attr("class", "popFemaleIndia")
            .attr("x", d => { return xScaleIndia(0) })
            .attr("y", d => { return yScaleIndia(d.AgeGrp) })
            .attr("width", d => { return (xScaleIndia(d["PopFemale"]) - xScaleIndia(0)) })
            .attr("height", yScaleIndia.bandwidth()-1)
            .attr("transform", `translate(${margin.left},0)`)

        svg.selectAll(".popMaleIndia")
            .data(IndiaData_21)
            .enter().append("rect")
            .attr("class", "popMaleIndia")
            .attr("x", d => { return xScaleIndia(d["PopMale"]) })
            .attr("y", d => { return yScaleIndia(d.AgeGrp) })
            .attr("width", d => { return (Math.abs(xScaleIndia(d["PopMale"]) - xScaleIndia(0))) })
            .attr("height", yScaleIndia.bandwidth()-1)
            .attr("transform", `translate(${margin.left},0)`)

        //Customize x axis labels
        d3.selectAll('.xAxisIndia>.tick>text')
        .each(function(d, i){
            d<0 ? d3.select(this).text(d*-1) : d3.select(this).text(d)            
        });


        ChinaData_21 = IndiaChinaData.filter(d => d['Location'] === 'China' && d['Time'] === "2021");
        ChinaData_21.forEach(d => {
            d.PopMale = -1 * d.PopMale;
        })

        let popMinChina = d3.min([d3.min(ChinaData_21, d => d["PopFemale"]), d3.min(ChinaData_21, d => d["PopMale"])]);
        let popMaxChina = d3.max([d3.max(ChinaData_21, d => d["PopFemale"]), d3.max(ChinaData_21, d => d["PopMale"])]);

        let xScaleChina = d3.scaleLinear()
                    .domain([popMinChina, popMaxChina])
                    .range([(width/2+(margin.left*2)), width-margin.right]);
        
        let xAxisChina = d3.axisBottom(xScaleChina);

        let yValChina = [];
        ChinaData_21.map(d => { return d["Time"] === "2021"? yValChina.push(d["AgeGrp"]): '' });
        let yScaleChina = d3.scaleBand()
                        .domain(yValChina)
                        .range([height-margin.bottom, margin.top]);

        // let yAxisChina = d3.axisLeft(yScaleChina);

        svg.append("g")
            .attr("class", "xAxisChina")
            .attr("transform", `translate(0, ${height-margin.bottom})`)
            .call(xAxisChina)
            .call(g => g.select('.domain').remove())
            // .call(g => g.selectAll('line').remove())

        // svg.append("g")
        //     .attr("transform", `translate(${width/2 + (margin.left*2)}, 0)`)
        //     .call(yAxisChina)
        //     .call(g => g.select('.domain').remove())
        //     .call(g => g.selectAll('line').remove())
        
        svg.selectAll(".popFemaleChina")
            .data(ChinaData_21)
            .enter().append("rect")
            .attr("class", "popFemaleChina")
            .attr("x", d => { return xScaleChina(0) })
            .attr("y", d => { return yScaleChina(d.AgeGrp) })
            .attr("width", d => { return (xScaleChina(d["PopFemale"]) - xScaleChina(0)) })
            .attr("height", yScaleChina.bandwidth()-1)

        svg.selectAll(".popMaleChina")
            .data(ChinaData_21)
            .enter().append("rect")
            .attr("class", "popMaleChina")
            .attr("x", d => { return xScaleChina(d["PopMale"]) })
            .attr("y", d => { return yScaleChina(d.AgeGrp) })
            .attr("width", d => { return (Math.abs(xScaleChina(d["PopMale"]) - xScaleChina(0))) })
            .attr("height", yScaleChina.bandwidth()-1)

        //Customize x axis labels
        d3.selectAll('.xAxisChina>.tick>text')
        .each(function(d, i){
            d<0 ? d3.select(this).text(d*-1) : d3.select(this).text(d)            
        });

        //Labels
        svg.selectAll(".textIndia")
            .data(IndiaData_21)
            .attr("class", "textIndia")
            .enter().append("text")
            .attr("x", d => xScaleIndia(0))
            .attr("y", margin.top)
            .attr("dy", -20)
            .attr("dx", 20)
            .attr("font-family", "Helvetica")
            .attr("fill", "#555")
            .text("India")

        svg.selectAll(".textMale")
            .data(IndiaData_21)
            .attr("class", "textMale")
            .enter().append("text")
            .attr("x", d => xScaleIndia(0))
            .attr("y", d => yScaleIndia("0-4"))
            .attr("dy", 60)
            .attr("dx", -50)
            .attr("font-family", "Helvetica")
            .attr("fill", "#666")
            .text("Male")

        svg.selectAll(".textFemale")
            .data(IndiaData_21)
            .attr("class", "textFemale")
            .enter().append("text")
            .attr("x", d => xScaleIndia(0))
            .attr("y", d => yScaleIndia("0-4"))
            .attr("dy", 60)
            .attr("dx", 80)
            .attr("font-family", "Helvetica")
            .attr("fill", "#666")
            .text("Female")

        svg.selectAll(".textChina")
            .data(IndiaData_21)
            .attr("class", "textChina")
            .enter().append("text")
            .attr("x", d => xScaleChina(0))
            .attr("y", margin.top)
            .attr("dy", -20)
            .attr("dx", -20)
            .attr("font-family", "Helvetica")
            .attr("fill", "#555")
            .text("China")
    });