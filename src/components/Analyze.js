import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Timeline from 'react18-vis-timeline';
import { DataSet } from 'vis-data';
import { ResponsiveLine } from '@nivo/line'

import '../timelinestyles.css';

import formatTimeline from '../utils/formatTimeline';
import formatPlotData from '../utils/formatPlotData';
import { julianToDate } from '../utils/julianConversion';

const timelineItems = new DataSet([]);
const timelineGroups = new DataSet([]);

const timelineOptions = {
  width: "100%",
  height: "300px",
  align: "left",
  timeAxis: {scale: 'second', step: 5},
  groupHeightMode: 'fixed',
}

export default function Analyze({ outputPath, lastStartJD }) {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [finishedLoadingTimeline, setFinishedLoadingTimeline] = useState(false);
  const [finishedLoadingStateData, setFinishedLoadingStateData] = useState(false);
  const [timelineFiles, setTimelineFiles] = useState([]);
  const [stateDataFiles, setStateDataFiles] = useState([]);
  const [selectedTimelineFile, setSelectedTimelineFile] = useState(undefined);
  const [selectedStateDataFile, setSelectedStateDataFile] = useState(undefined);
  const [scheduleValue, setScheduleValue] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [xAxisLegend, setXAxisLegend] = useState('');
  const [yAxisLegend, setYAxisLegend] = useState('');
  const [accordionOpen, setAccordionOpen] = useState(null);

  async function fetchTimelineFiles(outputPath) {
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        try {
          window.electronApi.fetchTimelineFiles(outputPath, resolve);
        } catch (error) {
          console.error("Error while fetching timelines files: ", error);
          reject(error);
        }
      }
    });
  }

  async function fetchStateDataFiles(outputPath) {
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        try {
          window.electronApi.fetchStateDataFiles(outputPath, resolve);
        } catch (error) {
          console.error("Error while fetching state data files: ", error);
          reject(error);
        }
      }
    });
  }

 async function fetchTimelineData(outputPath, selectedTimelineFile) {
  return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchLatestTimelineData(outputPath, selectedTimelineFile, ({ content, startJD }) => {
          const firstSchedule = content.split("Schedule Number: ")[1].slice(1);
          formatTimeline(firstSchedule, startJD).then(resolve).catch(reject);
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  function setTimelineData(items, groups) {
    if (timelineRef.current) {
      const { timeline, props } = timelineRef.current;
      timelineRef.current.timeline.on('click', ({ item, group }) => {
        if (item) {
          const clickedItem = timelineItems.get(item);
          console.log("Clicked item:", clickedItem);
        }
      });

      props.initialItems.clear();
      props.initialGroups.clear();
      props.initialItems.add(items);
      props.initialGroups.add(groups);

      timeline.fit();
    }
  }

  function setTimelineRange(startDatetime, endDatetime) {
    if (timelineRef.current) {
      const elapsed = endDatetime.diff(startDatetime.clone());

      timelineRef.current.timeline.setOptions({
        ...timelineOptions,
        min: startDatetime.toISOString(),
        max: endDatetime.clone().add(90, 'seconds').toISOString(),
        zoomMin: elapsed / 10,
        zoomMax: elapsed * 10,
      });
    }
  }

  function fetchStateData(outputPath, selectedStateDataFile) {
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchLatestStateData(outputPath, selectedStateDataFile, ({ content, startJD }) => {
          console.log(content, startJD);
          formatPlotData(content, startJD).then(resolve).catch(reject);
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  function updatePlot(data) {
    const { plotData, xAxisLegend, yAxisLegend } = data;
    console.log("Plot data:", plotData);
    setPlotData(plotData);
    setXAxisLegend(`Seconds after ${xAxisLegend} (s)`);
    setYAxisLegend(yAxisLegend);
    setFinishedLoadingStateData(true);
  }

  // Converts file names of the form "output-2024-10-02-1_22_13_38.txt" to "2024-10-02 1:22:13"
  function formatRunTime(fileName) {
    const [_, year, month, day, hour, minute, second] = fileName.split(/[-_]/);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // Converts file names of the form "asset1_databufferfillratio.csv" to "asset1 - databufferfillratio"
  function formatStateDataFile(fileName) {
    const [ asset, state ] = fileName.split('\\')[1].split('.')[0].split('_');
    return `${asset}: ${state}`;
  }

  function handleRunTimeChange(event) {
    setSelectedTimelineFile(event.target.value);
    setAccordionOpen('timeline');
  }

  function handleStateDataChange(event) {
    setSelectedStateDataFile(event.target.value);
    setAccordionOpen('state-data');
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setAccordionOpen(isExpanded ? panel : null);
  }

  // Fetch last output data on first render
  useEffect(() => {
    (async () => {
      try {
        const timelineFiles = await fetchTimelineFiles(outputPath);
        setTimelineFiles(timelineFiles);
        setFinishedLoadingTimeline(true);
      } catch (error) {
        console.error("Error while fetching timeline files: ", error);
      }
      try {
        const stateDataFiles = await fetchStateDataFiles(outputPath);
        setStateDataFiles(stateDataFiles);
        setFinishedLoadingStateData(true);
      } catch (error) {
        console.error("Error while fetching state data files: ", error);
      }
      // Preset timeline range to 15 seconds before and 90 seconds after the last start Julian date
      try {
        const dayJs = await julianToDate(lastStartJD);
        const startDatetime = dayJs.clone().add(-15, 'seconds');
        const endDatetime = dayJs.clone().add(90, 'seconds');
        setTimelineRange(startDatetime, endDatetime);
      } catch (error) {
        console.error("Error while converting Julian date to date: ", error);
      }
    })();
  }, []);

  // Fetch timeline data when selectedTimelineFile changes
  useEffect(() => {
    if (selectedTimelineFile) {
      (async() => {
        try {
          const {
            scheduleValue,
            startDatetime,
            endDatetime,
            items,
            groups } = await fetchTimelineData(outputPath, selectedTimelineFile);

          setScheduleValue(scheduleValue);
          setTimelineRange(startDatetime, endDatetime);
          setTimelineData(items, groups);
          setAccordionOpen('timeline');
        } catch (error) {
          console.error("Error while fetching timeline data: ", error);
        }
      })();
    }
  }, [selectedTimelineFile]);

  // Fetch state data when selectedStateDataFile changes
  useEffect(() => {
    if (selectedStateDataFile) {
      (async() => {
        try {
           updatePlot(await fetchStateData(outputPath, selectedStateDataFile));
        } catch (error) {
          console.error("Error while fetching state data: ", error);
        }
      })();
    }
  }, [selectedStateDataFile]);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        direction='row'
        spacing={1}
        align="left"
        alignSelf="flex-start"
        sx={{
          justifyContent: 'space-around',
          backgroundColor: '#EEEE',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          width: '900px',
        }}
      >
        <TextField
          id="simulation"
          label="Simulation"
          size="small"
          select
          value={selectedTimelineFile || ""}
          onChange={handleRunTimeChange}
          variant="outlined"
          color="primary"
          sx={{ width: '400px' }}
          disabled={!finishedLoadingTimeline || timelineFiles.length === 0}
          error={finishedLoadingTimeline && timelineFiles.length === 0}
          helperText={finishedLoadingTimeline && timelineFiles.length === 0 ? "No simulations found" : ""}
        >
          {timelineFiles.map((runTime, index) => (
            <MenuItem key={runTime} value={runTime}>
              {(index === 0 ? "Latest Simulation: ": "") + formatRunTime(runTime)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="state-data"
          label="State Data (Latest Simulation)"
          size="small"
          select
          value={selectedStateDataFile || ""}
          onChange={handleStateDataChange}
          variant="outlined"
          color="primary"
          sx={{ width: '400px' }}
          disabled={!finishedLoadingStateData || stateDataFiles.length === 0}
          error={finishedLoadingStateData && stateDataFiles.length === 0}
          helperText={finishedLoadingStateData && stateDataFiles.length === 0 ? "No state data files found" : ""}
        >
          {stateDataFiles.map((stateDataFile) => (
            <MenuItem key={stateDataFile} value={stateDataFile}>
              {formatStateDataFile(stateDataFile)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Accordion
        disabled={selectedTimelineFile === undefined}
        expanded={accordionOpen === 'timeline'}
        onChange={handleAccordionChange('timeline')}
        mt={2}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
         }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}>
          <Typography variant="h5" fontWeight="bold">
            {`Top schedule ${scheduleValue? '(value: ' + scheduleValue + ')' : ''}`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              backgroundColor: '#535671',
              borderRadius: '5px',
              padding: '15px',
            }}
          >
            {finishedLoadingTimeline && <Timeline
              ref={timelineRef}
              options={timelineOptions}
              initialItems={timelineItems}
              initialGroups={timelineGroups}
            />}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={selectedStateDataFile === undefined}
        expanded={accordionOpen === 'state-data'}
        onChange={handleAccordionChange('state-data')}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
          }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}>
          <Typography variant="h5" fontWeight="bold">State data plots</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {plotData.length > 0 &&
            <Box
              sx={{
                backgroundColor: '#535671',
                borderRadius: '5px',
                height: '500px',
                width: '100%',
              }}
            >
              <ResponsiveLine
                data={plotData}
                margin={{ top: 30, right: 20, bottom: 50, left: 70 }}
                curve="linear"
                axisBottom={{
                  format: '%S',
                  tickSize: 5,
                  tickPadding: 5,
                  tickValues: 'every 5 seconds',
                  legend: xAxisLegend,
                  legendOffset: 36,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  legend: yAxisLegend,
                  legendOffset: -50,
                  legendPosition: 'middle',
                }}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%d %H:%M:%S',
                  precision: 'second',
                  useUTC: false,
                }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                }}
                xFormat="time:%Y-%m-%d %H:%M:%S"
                yFormat=" >-.4~f"
                colors={{ scheme: 'set2' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={3}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-20}
                enableTouchCrosshair={false}
                useMesh={true}
              />
            </Box>
          }
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}