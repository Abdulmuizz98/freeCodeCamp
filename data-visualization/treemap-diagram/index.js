const links = [
  {
    category: "videogames",
    title: "Video Game Sales",
    description: "Top 100 Most Sold Video Games Grouped by Platform",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  },
  {
    category: "movies",
    title: "Movie Sales",
    description: "Top 100 Highest Grossing Movies Grouped By Genre",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  },
  {
    category: "kickstarter",
    title: "Kickstarter Pledges",
    description:
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  },
];

const displayLegend = (dataset, colorScale) => {
  // LEGEND VISUALIZATION
  const w = 500;
  const h = 250;

  const svg = d3
    .select(".chart-section")
    .append("svg")
    .attr("viewBox", [0, 0, w, h])
    .attr("width", w)
    .attr("height", h)
    .attr("style", "max-width: 100%; height: auto;");

  const yScale = (i) => Math.floor(i / 3) * 25;
  const xScale = (i) => (i % 3) * 150;

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(60, 10)")
    .attr("width", w)
    .attr("height", h);

  const legendItem = legend
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${xScale(i)}, ${yScale(i)})`);

  legendItem
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => colorScale(d));

  legendItem
    .append("text")
    .attr("x", 18)
    .attr("y", 13)
    .attr("font-size", "15")
    .text((d) => d);
};

const setTitleAndDescription = (linkData) => {
  d3.select("#title").text(linkData.title);
  d3.select("#description").text(linkData.description);
};

(async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const dataCategory = urlParams.has("data")
    ? urlParams.get("data")
    : "videogames";

  const linkData = links.find((el) => el.category === dataCategory);

  setTitleAndDescription(linkData);

  const data = await d3
    .json(linkData.url)
    .catch((error) => console.error("Error loading tree data:", error));

  const width = 960;
  const height = 570;

  const colorScale = d3.scaleOrdinal(
    data.children.map((d) => d.name),
    d3.schemeTableau10
  );

  const getColor = (d) => {
    while (d.depth > 1) d = d.parent;

    return colorScale(d.data.name);
  };

  const root = d3
    .treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(1)
    .round(true)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  const svg = d3
    .select(".chart-section")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  leaf
    .append("rect")
    .attr("fill", getColor)
    .attr("class", "tile")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("cursor", "pointer")
    .attr("data-name", (d) => d.name)
    .attr("data-value", (d) => d.value)
    .attr("data-category", (d) => d.category)
    .on("mousemove", mouseEntered)
    .on("mouseleave", mouseLeft);

  leaf
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(" "))
    .join("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => i * 10 + 13)
    .attr("font-size", "10")
    .text((d) => d);

  displayLegend(
    data.children.map((d) => d.name),
    colorScale
  );

  const tooltip = document.getElementById("tooltip");

  function mouseEntered(e, d) {
    const { name, category, value } = d.data;
    tooltip.setAttribute("data-value", value);
    tooltip.style.left = `${e.clientX + 20}px`;
    tooltip.style.top = `${e.clientY - 40}px`;

    tooltip.style.opacity = 0.9;
    tooltip.innerHTML =
      `<span>Name: ${name}</span><br/>` +
      `<span>Category: ${category}</span><br/>` +
      `<span>Value: ${value}</span>`;
  }

  function mouseLeft(e, d) {
    tooltip.style.opacity = 0;
  }
})();
