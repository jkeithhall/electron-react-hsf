import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Timeline from 'react18-vis-timeline';
import { DataSet } from 'vis-data';
import '../timelinestyles.css';
import { JulianDate } from 'cesium';
import { Viewer, CzmlDataSource, Clock } from "resium";
import dayjs from 'dayjs';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ResponsiveLine } from '@nivo/line';
import { lineChartProps } from '../nivoStyles';

import { getTimelineItemsGroups } from '../utils/parseOutputSchedule';
import formatPlotData from '../utils/formatPlotData';
import moment from 'moment';

const timelineItems = new DataSet([]);
const timelineGroups = new DataSet([]);

// onTick event fires every frame (60fps) even when the clock is paused
// so we throttle it to only update every 100ms
function throttle(callback, delay) {
  let lastCall = null;

  return function(...args) {
    if (lastCall === null) {
      lastCall = new Date();
      callback.apply(this, args);
    } else {
      const elapsed = new Date() - lastCall;

      if (elapsed >= delay) {
        lastCall = new Date();
        callback.apply(this, args);
      }
    }
  }
}

const timelineOptions = ({ $d: startDatetime }) => ({
  align: 'left',
  height: '500px',
  editable: false,
  tooltip: { delay: 100 },
  format: {
    minorLabels: ({ _d: labelDatetime }) => {
      return `${(labelDatetime - startDatetime) / 1000} s`;
    },
    majorLabels: ({ _d}) => {
      const year = _d.getUTCFullYear();
      const month = (_d.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = _d.getUTCDate().toString().padStart(2, '0');
      const hour = _d.getUTCHours().toString().padStart(2, '0');
      const minute = _d.getUTCMinutes().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hour}:${minute} (UTC)`;
    }
  },
});

export default function Analyze({ outputPath }) {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [finishedLoadingTimeline, setFinishedLoadingTimeline] = useState(false);
  const [finishedLoadingStateData, setFinishedLoadingStateData] = useState(false);
  const [timelineFiles, setTimelineFiles] = useState([]);
  const [stateDataFiles, setStateDataFiles] = useState([]);
  const [selectedTimelineFile, setSelectedTimelineFile] = useState(undefined);
  const [spinnerOpen, setSpinnerOpen] = useState(false);
  const [scheduleValue, setScheduleValue] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [latestSimulation, setLatestSimulation] = useState(null);
  const [selectedStateDataFile, setSelectedStateDataFile] = useState(undefined);
  const [currentTime, setCurrentTime] = useState('');
  const [plotType, setPlotType] = useState('line');
  const [plotData, setPlotData] = useState([]);
  const [xAxisLegend, setXAxisLegend] = useState('');
  const [yAxisLegend, setYAxisLegend] = useState('');
  const [czmlData, setCzmlData] = useState([]);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [cesiumOpen, setCesiumOpen] = useState(false);
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
          getTimelineItemsGroups(firstSchedule, startJD).then(resolve).catch(reject);
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  // vis-timeline is an old library that doesn't support React 18
  // react18-vis-timeline is a fork of vis-timeline that supports React 18
  // but it wants data updates to use the API on the DataSet objects
  // instead of directly modifying the data array
  function updateTimelineData(items, groups) {
    if (timelineRef.current) {
      const { timeline, props } = timelineRef.current;
      timelineRef.current.timeline.on('click', (event, properties) => {
        const { item } = event;
        if (item) {
          const { start } = timelineItems.get(item);
          setCzmlData(prevData => {
            const newData = [...prevData];
            newData[0].clock.currentTime = start;
            return newData;
          })
        }
      });

      props.initialItems.clear();
      props.initialGroups.clear();
      props.initialItems.add(items);
      props.initialGroups.add(groups);

      timeline.fit();
    }
  }

  function setTimebar(isoString) {
    if (timelineRef.current) {
      const { timeline } = timelineRef.current;
      if (!currentTime) {
        timeline.addCustomTime(isoString, 'current-time');
        timeline.customTimes[timeline.customTimes.length - 1].hammer.off("panstart panmove panend"); // Disable panning
        setCurrentTime(isoString);
      } else if (currentTime !== isoString) {
        timeline.setCustomTime(isoString, 'current-time');
        setCurrentTime(isoString);
      }
    }
  }

  function updateTimelineRange(startDatetime, endDatetime) {
    if (timelineRef.current) {
      const { timeline } = timelineRef.current;
      const elapsed = endDatetime.diff(startDatetime.clone());

      const options = {
        ...timelineOptions(startDatetime),
        min: startDatetime.clone().subtract(60, 'seconds').format(),
        max: endDatetime.clone().add(60, 'seconds').format(),
        zoomMin: elapsed / 100,
        zoomMax: elapsed * 10000,
        moment: (date) => moment(date).utc(),
      }

      timeline.setOptions(options);
      setTimebar(startDatetime.format());
    }
  }

  async function fetchCesiumData(outputPath, timelineFileName) {
    const cesiumFileName = timelineFileName.replace('.txt', '.czml');
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchCzmlData(outputPath, cesiumFileName, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  function handleClockTick({ currentTime }) {
    const { dayNumber, secondsOfDay } = currentTime;
    setTimebar(JulianDate.toIso8601(new JulianDate(dayNumber, secondsOfDay - 33), 0));
  }

  function fetchStateData(outputPath, selectedStateDataFile) {
    return new Promise((resolve, reject) => {
      if (window.electronApi) {
        window.electronApi.fetchLatestStateData(outputPath, selectedStateDataFile, ({ content, startJD }) => {
          formatPlotData(content, startJD).then(resolve).catch(reject);
        });
      } else {
        reject("No electron API found");
      }
    });
  }

  function updatePlot(data) {
    const { plotData, xAxisLegend, yAxisLegend, timeRange } = data;

    setPlotData(plotData);
    setXAxisLegend(`Time after ${xAxisLegend} (UTC) (s)`);
    setYAxisLegend(yAxisLegend);
    setFinishedLoadingStateData(true);
  }

  // Converts file names of the form "output-2024-10-02-1_22_13_38.txt" to "2024-10-02 1:22:13"
  function formatSimulationFileName(fileName) {
    const [_, year, month, day, hour, minute, second] = fileName.split(/[-_]/);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // Converts file names of the form "asset1_databufferfillratio.csv" to "asset1: databufferfillratio"
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

  function handlePlotTypeChange(event) {
    setPlotType(event.target.value);
    setTimeout(() => { setStateDataOpen(true); }, 0);
  }

  // Fetch last output data files on first render
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
  }, []);

  // Fetch and set timeline and cesium data when selectedTimelineFile changes
  useEffect(() => {
    if (selectedTimelineFile) {
      setSpinnerOpen(true);
      (async() => {
        if (selectedTimelineFile !== latestSimulation) {
          setSelectedStateDataFile(undefined);
          setStateDataOpen(false);
        }

        try {
          const {
            scheduleValue,
            startDatetime,
            endDatetime,
            items,
            groups } = await fetchTimelineData(outputPath, selectedTimelineFile);

          setScheduleValue(scheduleValue);
          setStartDatetime(startDatetime);
          updateTimelineRange(startDatetime, endDatetime);
          updateTimelineData(items, groups);
          setTimelineOpen(true);
        } catch (error) {
          console.error("Error while fetching timeline data: ", error);
        }
        try {
          const czmlData = await fetchCesiumData(outputPath, selectedTimelineFile);
          setCzmlData(czmlData);
          setCesiumOpen(true);
        } catch (error) {
          console.error("Error while fetching CZML data: ", error);
        }
        setStateDataOpen(true);
        setSpinnerOpen(false);
      })();
    }
  }, [selectedTimelineFile]);

  // Fetch and set state data when selectedStateDataFile changes
  useEffect(() => {
    if (selectedStateDataFile) {
      (async() => {
        try {
           updatePlot(await fetchStateData(outputPath, selectedStateDataFile));
           setStateDataOpen(true);
        } catch (error) {
          console.error("Error while fetching state data: ", error);
        }
      })();
    }
  }, [selectedStateDataFile]);

  const stateDataSelectorDisabled = stateDataFiles.length === 0 ||
    selectedTimelineFile !== latestSimulation;

  const currentSeconds = currentTime && startDatetime ? dayjs(currentTime).diff(dayjs(startDatetime), 'seconds') : null;

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={spinnerOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
              ref={timelineRef}
              options={timelineOptions}
              initialItems={timelineItems}
              initialGroups={timelineGroups}
            />}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={selectedTimelineFile === undefined}
        expanded={cesiumOpen}
        onChange={() => setCesiumOpen(!cesiumOpen)}
        mt={2}
        mb={2}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
         }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}>
          <Typography variant="h5" fontWeight="bold">
            Geospatial Visualization
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {czmlData.length > 0 &&
            <Viewer fullscreenButton={false}>
              <CzmlDataSource data={czmlData} />
              <Clock onTick={throttle(handleClockTick, 100)} />
            </Viewer>
          }
        </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={stateDataSelectorDisabled}
        expanded={stateDataOpen}
        onChange={() => setStateDataOpen(!stateDataOpen)}
        disableGutters={true}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee',
          marginBottom: '40px',
          }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}>
          <Typography variant="h5" fontWeight="bold">State data</Typography>
        </AccordionSummary>
        <AccordionDetails mb={2}>
          {!stateDataSelectorDisabled &&
            <>
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: '#eee',
                padding: '10px',
              }}>
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
                <TextField
                  id="plot-type"
                  label="Plot Type"
                  size="small"
                  select
                  value={plotType}
                  onChange={handlePlotTypeChange}
                  variant="outlined"
                  disabled={stateDataSelectorDisabled}
                  color="primary"
                  sx={{ width: '200px', textAlign: 'left', marginLeft: '10px' }}
                >
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="scatterPlot">Scatter Plot</MenuItem>
                </TextField>
              </div>
              {plotData.length > 0 && <Box
                sx={{
                  height: '400px',
                  width: '100%',
                }}
              >
                {plotType === 'line' ?
                  <ResponsiveLine
                    data={plotData}
                    {...lineChartProps(plotType, xAxisLegend, yAxisLegend, currentSeconds)}
                  /> :
                  <ResponsiveScatterPlot
                    data={plotData}
                    {...lineChartProps(plotType, xAxisLegend, yAxisLegend, currentSeconds)}
                  />
                }
              </Box>}
            </>
          }
        </AccordionDetails>
      </Accordion>
      <Box sx={{ height: '10px' }} />
    </ThemeProvider>
  );
}