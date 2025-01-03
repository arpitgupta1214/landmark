const width = 975;
const height = 610;

const allowedStates = [
    "California",
    "New Mexico",
    "Kansas",
    "Illinois",
    "Missouri"
];

const svg = d3.select("#us-map");

const path = d3.geoPath();
let selectedState = null;

// Load data
Promise.all([
    d3.json("https://unpkg.com/us-atlas@3/states-albers-10m.json"),
]).then(([us]) => {
    const states = topojson.feature(us, us.objects.states).features;
    const mesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

    // Draw states
    svg.selectAll(".state")
        .data(states)
        .enter().append("path")
        .attr("class", d =>
            allowedStates.includes(d.properties.name) ? "state enabled" : "state"
        )
        .attr("d", path)
        .on("click", (event, d) => {
            if (!allowedStates.includes(d.properties.name)) return; // Ignore unallowed states

            selectedState = selectedState === d.id ? null : d.id;

            if (selectedState) {
                const stateName = d.properties.name.toLowerCase().replace(/\s+/g, "-");
                window.location.href = `/${stateName}.html`;
            }

            updateOutline(d);
        });

    // Draw state boundaries
    svg.append("path")
        .datum(mesh)
        .attr("class", "state-boundary")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("pointer-events", "none")
        .attr("d", path);

    // State outline
    const outline = svg.append("path")
        .attr("class", "outline");

    function updateOutline(d) {
        outline.attr("d", selectedState ? path(d) : null);
    }
});