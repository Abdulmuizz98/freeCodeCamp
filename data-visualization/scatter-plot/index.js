const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

(async () => {
  const dataset = await fetch(url).then((res) => res.json());

  const w = 920;
  const h = 630;
  const padding = 70;

  const yMax = d3.max(dataset, (d) => new Date(d.Seconds * 1000));
  const yMin = d3.min(dataset, (d) => new Date(d.Seconds * 1000));
  const xMin = d3.min(dataset, (d) => d.Year);
  const xMax = d3.max(dataset, (d) => d.Year);

  const yScale = d3
    .scaleTime()
    .domain([yMin, yMax])
    .range([padding, h - padding]);

  const xScale = d3
    .scaleLinear()
    .domain([xMin - 1, xMax + 1])
    .range([padding, w - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(""));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.utcFormat("%M:%S"));

  const svg = d3
    .select(".chart-section")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("text")
    .text("Time in Minutes")
    .attr("x", "-250")
    .attr("y", "15")
    .attr("font-size", "12")
    .attr("transform", "rotate(-90)");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 6)
    .attr("stroke", "black")
    .attr("class", "dot")
    .attr("fill", (d) => (d.Doping ? "rgb(31, 119, 180)" : "rgb(255, 127, 14)"))
    .attr("data-xvalue", (d) => d.year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000).toISOString())
    .attr("index", (d, i) => i);

  svg
    .append("g")
    .attr("transform", `translate(0,${h - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  // LEGEND VISUALIZATION
  const legendSet = [
    {
      translate: "translate(0,250)",
      fill: "rgb(31, 119, 180)",
      text: "Riders with doping allegations",
    },
    {
      translate: "translate(0,230)",
      fill: "rgb(255, 127, 14)",
      text: "No doping allegations",
    },
  ];

  const legend = svg.append("g").attr("id", "legend");
  legend
    .selectAll("g")
    .data(legendSet)
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", (d) => d.translate);

  legend
    .selectAll(".legend-label")
    .data(legendSet)
    .append("rect")
    .attr("x", "822")
    .attr("width", "18")
    .attr("height", "18")
    .attr("fill", (d) => d.fill);

  legend
    .selectAll(".legend-label")
    .data(legendSet)
    .append("text")
    .text((d) => d.text)
    .attr("x", "816")
    .attr("y", "9")
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("font-size", "11");

  const tooltip = document.getElementById("tooltip");
  const circles = document.querySelectorAll("circle");

  circles.forEach((circle) => {
    circle.addEventListener("mouseenter", () => {
      const circleIndex = Number(circle.getAttribute("index"));
      const circleData = dataset[circleIndex];

      tooltip.style.left = `${Number(circle.getAttribute("cx"))}px`;
      tooltip.style.top = `${Number(circle.getAttribute("cy"))}px`;
      tooltip.setAttribute("data-year", circleData.Year);

      tooltip.style.opacity = 0.9;
      tooltip.innerHTML =
        `<span>${circleData.Name}: ${circleData.Nationality}</span> <br/>` +
        `<span>Year: ${circleData.Year}, Time: ${circleData.Time}</span><br/>`;
      tooltip.innerHTML += circleData.Doping
        ? `<br/><span>${circleData.Doping}</span>`
        : "";
    });

    circle.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });
  });
})();
