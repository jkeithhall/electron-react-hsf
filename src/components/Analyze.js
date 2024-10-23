import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Timeline } from 'react-svg-timeline'

import { ResponsiveLine } from '@nivo/line';
import { lineChartProps } from '../nivoconfig';

import formatTimeline from '../utils/formatTimeline';
import formatPlotData from '../utils/formatPlotData';

export default function Analyze({ outputPath, lastStartJD }) {
  const theme = useTheme();
  const timelineContainerRef = useRef(null);

  const [finishedLoadingTimeline, setFinishedLoadingTimeline] = useState(false);
  const [finishedLoadingStateData, setFinishedLoadingStateData] = useState(false);
  const [timelineFiles, setTimelineFiles] = useState([]);
  const [stateDataFiles, setStateDataFiles] = useState([]);
  const [selectedTimelineFile, setSelectedTimelineFile] = useState(undefined);
  const [scheduleValue, setScheduleValue] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [timelineLanes, setTimelineLanes] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [latestSimulation, setLatestSimulation] = useState(null);
  const [selectedStateDataFile, setSelectedStateDataFile] = useState(undefined);
  const [useUTC, setUseUTC] = useState(true);
  const [plotData, setPlotData] = useState([]);
  const [xAxisLegend, setXAxisLegend] = useState('');
  const [yAxisLegend, setYAxisLegend] = useState('');
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [stateDataOpen, setStateDataOpen] = useState(false);

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

  function fetchStateData(outputPath, selectedStateDataFile, useUTC) {
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchLatestStateData(outputPath, selectedStateDataFile, ({ content, startJD }) => {
          formatPlotData(content, startJD, useUTC).then(resolve).catch(reject);
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  function updatePlot(data, useUTC) {
    const { plotData, xAxisLegend, yAxisLegend, timeRange } = data;

    setPlotData(plotData);
    setXAxisLegend(`Time after ${xAxisLegend + (useUTC ? ' (UTC)' : ' (local time)')} (s)`);
    setYAxisLegend(yAxisLegend);
    setFinishedLoadingStateData(true);
  }

  // Converts file names of the form "output-2024-10-02-1_22_13_38.txt" to "2024-10-02 1:22:13"
  function formatSimulationFileName(fileName) {
    const [_, year, month, day, hour, minute, second] = fileName.split(/[-_]/);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // Converts file names of the form "asset1_databufferfillratio.csv" to "asset1 - databufferfillratio"
  function formatStateDataFile(fileName) {
    const adjustedFileName = fileName.includes('\\') ? fileName.split('\\')[1] : fileName;
    const [ asset, state ] = adjustedFileName.split('.')[0].split('_');
    return `${asset}: ${state}`;
  }

  function handleSimulationFileChange(event) {
    setSelectedTimelineFile(event.target.value);
    if (event.target.value !== latestSimulation) {
      setSelectedStateDataFile(undefined);
    }
  }

  function handleStateDataChange(event) {
    setSelectedStateDataFile(event.target.value);
  }

  const timelineDateFormat = (useUTC) => (ms) => {
    const date = new Date(ms);
    const elapsedSeconds = Math.floor((date - startTime) / 1000);
    const options = { timeZoneName: 'short' };
    if (useUTC) options.timeZone = 'UTC';

    const fullDatetime = date.toLocaleString("en-GB", options);
    return `${elapsedSeconds}s\n(${fullDatetime})`;
  };

  // On first render fetch timeline and state data files and create timeline width listener
  useEffect(() => {
    (async () => {
      try {
        const timelineFiles = await fetchTimelineFiles(outputPath);
        setLatestSimulation(timelineFiles[0]);
        setTimelineFiles(timelineFiles);
        setFinishedLoadingTimeline(true);
      } catch (error) {
        console.error("Error while fetching timeline files: ", error);
      }
      try {
        const stateDataFiles = await fetchStateDataFiles(outputPath);
        setStateDataFiles(stateDataFiles.filter((file) => !file.includes('eci_pointing_vector')));
        setFinishedLoadingStateData(true);
      } catch (error) {
        console.error("Error while fetching state data files: ", error);
      }
    })();
    const updateWidth = () => {
      if (timelineContainerRef.current) {
        setTimelineWidth(timelineContainerRef.current.offsetWidth);
      }
    };

    // Initial update
    updateWidth();

    // Update width when the window is resized
    window.addEventListener('resize', updateWidth);

    // Cleanup listener
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Fetch timeline data when selectedTimelineFile changes
  useEffect(() => {
    if (selectedTimelineFile) {
      (async() => {
        if (selectedTimelineFile !== latestSimulation) {
          setSelectedStateDataFile(undefined);
          setStateDataOpen(false);
        }

        try {
          const {
            scheduleValue,
            startTime,
            events,
            lanes } = await fetchTimelineData(outputPath, selectedTimelineFile);

          setScheduleValue(scheduleValue);
          setStartTime(startTime);
          setTimelineEvents(events);
          setTimelineLanes(lanes);
          setTimelineOpen(true);
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
           updatePlot(await fetchStateData(outputPath, selectedStateDataFile, useUTC), useUTC);
           setStateDataOpen(true);
        } catch (error) {
          console.error("Error while fetching state data: ", error);
        }
      })();
    }
  }, [selectedStateDataFile]);

  useEffect(() => {
    if (finishedLoadingStateData && selectedStateDataFile) {
      (async() => {
        try {
          updatePlot(await fetchStateData(outputPath, selectedStateDataFile, useUTC), useUTC);
        } catch (error) {
          console.error("Error while fetching state data: ", error);
        }
      })();
    }
  }, [useUTC]);

  const stateDataSelectorDisabled = stateDataFiles.length === 0 ||
    selectedTimelineFile !== latestSimulation;

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
          margin: '10px 10px 20px 10px',
          borderRadius: '5px',
          width: '700px',
        }}
      >
        <TextField
          id="simulation"
          label="Simulation"
          size="small"
          select
          value={selectedTimelineFile || ""}
          onChange={handleSimulationFileChange}
          variant="outlined"
          color="primary"
          sx={{ width: '300px' }}
          disabled={timelineFiles.length === 0}
          error={finishedLoadingTimeline && timelineFiles.length === 0}
          helperText={finishedLoadingTimeline && timelineFiles.length === 0 ? "No simulations found" : ""}
        >
          {timelineFiles.map((fileName, index) => (
            <MenuItem key={fileName} value={fileName}>
              {(index === 0 ? "Latest Simulation: ": "") + formatSimulationFileName(fileName)}
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
          sx={{ width: '300px' }}
          disabled={stateDataSelectorDisabled}
          error={finishedLoadingStateData && stateDataFiles.length === 0}
          helperText={finishedLoadingStateData && stateDataFiles.length === 0 ? "No state data files found" : ""}
        >
          {stateDataFiles.map((stateDataFile) => (
            <MenuItem key={stateDataFile} value={stateDataFile}>
              {formatStateDataFile(stateDataFile)}
            </MenuItem>
          ))}
        </TextField>
        <Tooltip title={`Displaying ${useUTC ? 'UTC' : 'local time'}`} placement="top">
          <Checkbox
            checked={!useUTC}
            onChange={(event) => setUseUTC(!event.target.checked)}
            icon={<LocationOffIcon />}
            checkedIcon={<LocationOnIcon />}
          />
        </Tooltip>
      </Stack>
      <Accordion
        disabled={selectedTimelineFile === undefined}
        expanded={timelineOpen}
        onChange={() => setTimelineOpen(!timelineOpen)}
        disableGutters={true}
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
          <div className="timeline-container">
            {finishedLoadingTimeline && <Timeline
              width={timelineWidth - 40}
              height={timelineLanes.length * 150}
              lanes={timelineLanes}
              events={timelineEvents}
              dateFormat={timelineDateFormat(useUTC)}
            />}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={selectedStateDataFile === undefined}
        expanded={stateDataOpen}
        onChange={() => setStateDataOpen(!stateDataOpen)}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee',
          marginBottom: '20px',
          }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}>
          <Typography variant="h5" fontWeight="bold">State data</Typography>
        </AccordionSummary>
        <AccordionDetails mb={2}>
          {plotData.length > 0 &&
            <Box
              sx={{
                height: '400px',
                width: '100%',
              }}
            >
              <ResponsiveLine
                data={plotData}
                {...lineChartProps(xAxisLegend, yAxisLegend)}
              />
            </Box>
          }
        </AccordionDetails>
      </Accordion>
      <Box sx={{ height: '10px' }} />
    </ThemeProvider>
  );
}