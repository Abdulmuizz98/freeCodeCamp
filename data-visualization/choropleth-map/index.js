const displayLegend = (svg, width, height) => {
  // LEGEND VISUALIZATION
  const w = 200;
  const h = 60;

  const colors = [
    "#e5f5e0",
    "#c7e9c0",
    "#a1d99b",
    "#74c476",
    "#41ab5d",
    "#238b45",
    "#006d2c",
  ];
  const twoThirdWidth = (2 * width) / 3;

  const xScale = d3
    .scaleLinear()
    .domain([0, colors.length])
    .range([twoThirdWidth, twoThirdWidth + w]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(8)
    .tickFormat(
      (i) => ["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"][i]
    )
    .tickSize(15);

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("width", w)
    .attr("height", h);

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => 50)
    .attr("height", "10")
    .attr("width", "30")
    .attr("fill", (d) => d);

  // Append legend xAxis
  legend
    .append("g")
    .attr("transform", `translate(0,${50})`)
    .attr("class", "axis")
    .attr("id", "axis")
    .call(xAxis);
};

(async () => {
  const countyUrl =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
  const eduUrl =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

  const eduDataset = await fetch(eduUrl).then((res) => res.json());
  const countyJson = await d3
    .json(countyUrl)
    .catch((error) =>
      console.error("Error loading county GeoJSON data:", error)
    );

  const countyDataset = topojson.feature(
    countyJson,
    countyJson.objects.counties
  ).features;

  const width = 975;
  const height = 610;

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  const svg = d3
    .select(".chart-section")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;")
    .on("click", reset);

  const g = svg.append("g");
  const path = d3.geoPath();

  const getEdDataByCountyId = (id) => eduDataset.find((el) => el.fips === id);
  const getColor = (d) => {
    const eduPercent = getEdDataByCountyId(d.id).bachelorsOrHigher;

    if (eduPercent > 57) return "#006d2c";
    else if (eduPercent > 48) return "#238b45";
    else if (eduPercent > 39) return "#41ab5d";
    else if (eduPercent > 30) return "#74c476";
    else if (eduPercent > 21) return "#a1d99b";
    else if (eduPercent > 12) return "#c7e9c0";
    else if (eduPercent > 3) return "#e5f5e0";
    else return "#444";
  };

  const counties = g
    .append("g")
    .selectAll("path")
    .data(countyDataset)
    .join("path")
    .attr("fill", getColor)
    .attr("class", "county")
    .attr("cursor", "pointer")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => getEdDataByCountyId(d.id).bachelorsOrHigher)
    .on("click", clicked)
    .on("mouseenter", mouseEntered)
    .on("mouseleave", mouseLeft)
    .attr("d", path);

  g.append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr(
      "d",
      path(
        topojson.mesh(countyJson, countyJson.objects.states, (a, b) => a !== b)
      )
    );

  displayLegend(svg, width, height);

  svg.call(zoom);

  function reset() {
    // states.transition().style("fill", null);
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    // counties.transition().style("fill", null);
    // d3.select(this).transition().style("fill", "red");
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
  }

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  const tooltip = document.getElementById("tooltip");

  function mouseEntered(e, d) {
    const eduCounty = getEdDataByCountyId(d.id);
    const { state, area_name: county, bachelorsOrHigher } = eduCounty;
    // const path = e.target;

    tooltip.setAttribute("data-education", bachelorsOrHigher);
    tooltip.style.left = `${e.clientX + 20}px`;
    tooltip.style.top = `${e.clientY - 40}px`;
    console.log(e.clientX, e.clientY);

    tooltip.style.opacity = 0.7;
    tooltip.innerHTML = `<span>${county}, ${state}: ${bachelorsOrHigher}%</span>`;
  }

  function mouseLeft(e, d) {
    tooltip.style.opacity = 0;
  }
})();
