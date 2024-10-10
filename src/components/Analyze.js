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

import '../timelinestyles.css';

import formatTimeline from '../utils/formatTimeline';
import { julianToDate } from '../utils/julianConversion';

const timelineItems = new DataSet([]);
const timelineGroups = new DataSet([]);
const plotItems = new DataSet([]);

const timelineOptions = {
  width: "100%",
  height: "300px",
  align: "left",
  showTooltips: true,
  timeAxis: {scale: 'second', step: 5},
  groupHeightMode: 'fixed',
}

export default function Analyze({ outputPath, startJD }) {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [finishedLoadingTimeline, setFinishedLoadingTimeline] = useState(false);
  const [finishedLoadingStateData, setFinishedLoadingStateData] = useState(false);
  const [timelineFiles, setTimelineFiles] = useState([]);
  const [stateDataFiles, setStateDataFiles] = useState([]);
  const [selectedTimelineFile, setSelectedTimelineFile] = useState(undefined);
  const [selectedStateDataFile, setSelectedStateDataFile] = useState(undefined);
  const [scheduleValue, setScheduleValue] = useState('');
  const [accordionOpen, setAccordionOpen] = useState(null);

 async function fetchTimelineData(outputPath, selectedTimelineFile) {
  return new Promise((resolve, reject) => {
      if (window.electronApi) {
        console.log("Fetching timeline data for:", selectedTimelineFile);
        window.electronApi.fetchLatestTimelineData(outputPath, selectedTimelineFile, ({ content, startJD }) => {
          const firstSchedule = content.split("Schedule Number: ")[1].slice(1);
          formatTimeline(firstSchedule, startJD).then(resolve).catch(reject);
        });
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
    console.log("Fetching state data for:", selectedStateDataFile);
    if (window.electronApi) {
      window.electronApi.fetchLatestStateData(outputPath, selectedStateDataFile, (content) => {
        try {
          console.log("State data content:", content);
        } catch (error) {
          console.error("Error while fetching state data: ", error);
        }
      });
    }
  }

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

  // Fetch last output data on first render
  useEffect(() => {
    fetchStateDataFiles(outputPath);
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
      try {
        const dayJs = await julianToDate(startJD);
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
      fetchStateData(outputPath, selectedStateDataFile);
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
        mt={2}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
         }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: 'white' }}
              onClick={() => setAccordionOpen(status => {
                if (status === 'timeline') {
                  return null;
                } else {
                  return 'timeline';
                }
              })}
            />}
        >
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
        sx={{
          width: '100%',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
          }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{ color: 'white' }}
              onClick={() => setAccordionOpen(status => {
                if (status === 'state-data') {
                  return null;
                } else {
                  return 'state-data';
                }
              })}
            />}
        >
          <Typography variant="h5" fontWeight="bold">State data plots</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              backgroundColor: '#535671',
              borderRadius: '5px',
              padding: '20px',
            }}
          >
            {/* State data plots go here */}
          </Box>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}