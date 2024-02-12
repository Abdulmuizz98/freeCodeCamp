const marginLeft = 130,
  marginTop = 10,
  marginBottom = 130,
  marginRight = 10;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// Function to get month name from numeric representation
function getMonthName(monthNumber) {
  // Ensure the monthNumber is within valid range (0 to 11)
  if (monthNumber >= 0 && monthNumber <= 11) {
    return monthNames[monthNumber];
  } else {
    return "Invalid Month";
  }
}
const getColor = (baseTemp) => {
  return (d) => {
    const temp = baseTemp + d.variance;
    if (temp > 11.7) return "#d73027";
    else if (temp > 10.6) return "#f46d43";
    else if (temp > 9.5) return "#fdae61";
    else if (temp > 8.3) return "#fee090";
    else if (temp > 7.2) return "#ffffbf";
    else if (temp > 6.1) return "#e0f3f8";
    else if (temp > 5.0) return "#abd9e9";
    else if (temp > 3.9) return "#74add1";
    else return "#4575b4";
  };
};

const displayHeading = (chartSection, minYear, maxYear, baseTemp) => {
  chartSection
    .select("heading")
    .append("h2")
    .text(`${minYear} - ${maxYear}: base temperature ${baseTemp}℃`)
    .attr("id", "description");
};

const displayMap = (svg, dataset, baseTemp, xScale, yScale, width, height) => {
  svg
    .append("text")
    .text("Months")
    .attr("x", height / -2)
    .attr("y", "15")
    .attr("font-size", "12")
    .attr("transform", "rotate(-90)");

  svg
    .append("text")
    .text("Years")
    .attr("x", width / 2)
    .attr("y", "450")
    .attr("font-size", "12");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year) - 2.5)
    .attr("y", (d) => yScale(d.month) - 16.5)
    .attr("height", "33")
    .attr("width", "5")
    .attr("stroke", getColor(baseTemp))
    .attr("class", "cell")
    .attr("fill", getColor(baseTemp))
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d) => d.month)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("index", (d, i) => i);
};

const displayAxis = (svg, xAxis, yAxis, height) => {
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);
};

const displayLegend = (svg, height) => {
  // LEGEND VISUALIZATION
  const w = 500;
  const h = 60;
  const colors = [
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
  ];
  let startX = 1;
  const legendSet = colors.map((color) => {
    const res = { x: startX, color };
    startX += 1;
    return res;
  });

  const xScale = d3.scaleLinear().domain([0, 11]).range([marginLeft, w]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(10)
    .tickFormat(
      (i) => [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8][i - 1]
    );

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("width", w)
    .attr("height", h);

  legend
    .selectAll("rect")
    .data(legendSet)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.x))
    .attr("y", (d) => height - 50 - 25)
    .attr("height", "25")
    .attr("width", 34)
    .attr("stroke", "black")
    .attr("class", "cell")
    .attr("fill", (d) => d.color);

  // Append legend xAxis
  legend
    .append("g")
    .attr("transform", `translate(0,${height - 50})`)
    .attr("id", "x-axis")
    .call(xAxis);
};

(async () => {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  const dataMap = await fetch(url).then((res) => res.json());
  const baseTemperature = dataMap.baseTemperature;
  const dataset = dataMap.monthlyVariance;

  const width = 1603;
  const height = 540;

  const yMax = d3.max(dataset, (d) => d.month);
  const yMin = d3.min(dataset, (d) => d.month);
  const xMin = d3.min(dataset, (d) => d.year);
  const xMax = d3.max(dataset, (d) => d.year);

  const yScale = d3
    .scaleLinear()
    .domain([yMin - 0.5, yMax + 0.5])
    .range([marginTop, height - marginBottom]);

  const xScale = d3
    .scaleLinear()
    .domain([xMin - 1, xMax + 1])
    .range([marginLeft, width - marginRight]);

  const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d3.format(""));
  const yAxis = d3.axisLeft(yScale).tickFormat((i) => monthNames[i - 1]);

  const chartSection = d3.select(".chart-section");

  const svg = chartSection
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  displayHeading(chartSection, xMin, xMax, baseTemperature);
  displayMap(svg, dataset, baseTemperature, xScale, yScale, width, height);
  displayAxis(svg, xAxis, yAxis, height);
  displayLegend(svg, height);

  const tooltip = document.getElementById("tooltip");
  const rects = document.querySelectorAll("rect");

  rects.forEach((rect) => {
    rect.addEventListener("mouseenter", () => {
      const rectIndex = Number(rect.getAttribute("index"));
      const rectData = dataset[rectIndex];
      console.log(rectData);

      tooltip.style.left = `${Number(rect.getAttribute("x")) + marginLeft}px`;
      tooltip.style.top = `${Number(rect.getAttribute("y")) + 33}px`;
      tooltip.setAttribute("data-year", rectData.year);

      tooltip.style.opacity = 0.9;
      tooltip.innerHTML =
        `<span>${rectData.year} - ${
          monthNames[rectData.month - 1]
        }</span> <br/>` +
        `<span>${(rectData.variance + baseTemperature).toFixed(
          1
        )}℃</span><br/>` +
        `<span>${rectData.variance.toFixed(1)}℃</span>`;
    });

    rect.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });
  });
})();
