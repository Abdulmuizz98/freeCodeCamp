const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

(async () => {
  const dataset = await fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

  const w = 900;
  const h = 460;
  const padding = 70;
  const barWidth = (w - padding) / dataset.length;

  const yMax = d3.max(dataset, (d) => d[1]);
  const xMin = d3.min(dataset, (d) => new Date(d[0]));
  const xMax = d3.max(dataset, (d) => new Date(d[0]));

  const xScale = d3
    .scaleUtc()
    .domain([xMin, xMax])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select(".chart-section")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("text")
    .text("Gross Domestic Product")
    .attr("x", "-250")
    .attr("y", "90")
    .attr("transform", "rotate(-90)");

  svg
    .append("text")
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    .attr("x", w - 400)
    .attr("y", h - 10)
    .attr("font-size", "12");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(new Date(d[0])))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d, i) => yScale(0) - yScale(d[1]))
    .attr("class", "bar")
    .attr("fill", "rgb(51, 173, 255)")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
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

  const tooltip = document.getElementById("tooltip");
  const rects = document.querySelectorAll("rect");

  rects.forEach((rect) => {
    rect.addEventListener("mouseenter", () => {
      const dataDate = rect.getAttribute("data-date");
      const date = new Date(dataDate);
      const gdp = rect.getAttribute("data-gdp");
      rect.setAttribute("fill", "white");

      tooltip.setAttribute("data-date", dataDate);
      tooltip.style.left = `${Number(rect.getAttribute("x")) + 10}px`;
      tooltip.style.opacity = 0.7;
      tooltip.innerHTML = `<span>${date.getUTCFullYear()}, Q${
        (date.getMonth() + 3) / 3
      } </span> <span>\$${Number(gdp).toLocaleString("en-us")} billion</span>`;
    });

    rect.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
      rect.setAttribute("fill", "rgb(51, 173, 255)");
    });
  });
})();
