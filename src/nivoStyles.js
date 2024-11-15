export const lineChartProps = (
  plotType,
  xAxisLegend,
  yAxisLegend,
  currentSeconds,
) => {
  return {
    margin: { top: 30, right: 20, bottom: 50, left: 70 },
    curve: "linear",
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      legend: xAxisLegend,
      legendOffset: 36,
      legendPosition: "middle",
    },
    axisLeft: {
      legend: yAxisLegend,
      legendOffset: -50,
      legendPosition: "middle",
    },
    xScale: { type: "linear" },
    yScale: { type: "linear" },
    yFormat: " >-.4~f",
    tooltip: (input) => {
      let x, y;
      if (plotType === "scatterPlot") {
        x = input.node.formattedX;
        y = input.node.formattedY;
      } else {
        x = input.point.data.xFormatted;
        y = input.point.data.yFormatted;
      }
      return (
        <div
          style={{
            background: "rgba(220, 220, 220, 0.7)",
            fontSize: "11px",
            color: "#333",
            padding: "7px 10px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        >
          <div>{`x: ${x}`}</div>
          <div>{`y: ${y}`}</div>
        </div>
      );
    },
    colors: { scheme: "set2" },
    pointSize: 6,
    enableTouchCrosshair: false,
    useMesh: true,
    markers: [
      {
        axis: "x",
        legend: "",
        legendOffsetX: 0, // Required field
        legendOffsetY: 0, // Required field
        legendOrientation: "horizontal", // Required field
        lineStyle: {
          stroke: "#d32f2f",
          strokeWidth: 2,
        },
        value: currentSeconds,
      },
    ],
    theme: {
      background: "#eee",
      text: {
        fontSize: 11,
        fill: "#000000",
        outlineWidth: 0,
        outlineColor: "#000000",
      },
      axis: {
        domain: {
          line: {
            stroke: "#ccc",
            strokeWidth: 1,
          },
        },
        legend: {
          text: {
            fontSize: 12,
            fill: "#666",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
        },
        ticks: {
          line: {
            stroke: "#ccc",
            strokeWidth: 1,
          },
          text: {
            fontSize: 11,
            fill: "#666",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
        },
      },
      grid: {
        line: {
          stroke: "#ccc",
          strokeWidth: 1,
        },
      },
    },
  };
};
