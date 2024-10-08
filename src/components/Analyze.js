import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Timeline from 'react18-vis-timeline';
import { DataSet } from 'vis-data';

import formatTimeline from '../utils/formatTimeline';

let firstSelect = true;
let timelineItems = new DataSet([]);
let timelineGroups = new DataSet([]);
const timelineOptions = {
  width: "100%",
  height: "300px",
  align: "left",
  showTooltips: true,
  timeAxis: {scale: 'second', step: 5},
  groupHeightMode: 'fixed',
}

export default function Analyze({ outputPath, startJD, lastRun }) {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [selectedRunTime, setSelectedRunTime] = useState(undefined);
  const [runTimes, setRunTimes] = useState([]);
  const [scheduleValue, setScheduleValue] = useState('');
  const [timelineOpen, setTimelineOpen] = useState(false);


  function fetchTimelineData(outputPath, selectedRunTime) {
    if (window.electronApi) {
      window.electronApi.fetchTimelineData(outputPath, selectedRunTime, (content) => {
        try {
          const firstSchedule = content.split("Schedule Number: ")[1].slice(1);
          const { scheduleValue: value, startTime, endTime, items, groups } = formatTimeline(firstSchedule, startJD);

          console.log("Formatted Timeline Data:", {
            value,
            startTime,
            endTime,
            items,
            groups
          });

          setScheduleValue(value);
          if (timelineRef.current) {
            timelineRef.current.props.initialItems.clear();
            timelineRef.current.props.initialGroups.clear();
            timelineRef.current.props.initialItems.add(items);
            timelineRef.current.props.initialGroups.add(groups);
            timelineRef.current.timeline.fit();
          }

          if (firstSelect) {
            setTimelineOpen(true);
            firstSelect = false;
          }
        } catch (error) {
          console.error("Error while fetching timeline data: ", error);
        }
      });
    }
  }

  function fetchRunTimes(outputPath) {
    if (window.electronApi) {
      try {
        console.log("Fetching run times from output path:", outputPath);
        window.electronApi.fetchRunTimes(outputPath, (runTimes) => {
          console.log("Run times fetched:", runTimes);
          setRunTimes(runTimes)
      });
      } catch (error) {
        console.error("Error while fetching run times: ", error);
      }
    }
  }

  function formatRunTime(fileName) {
    // output-2024-10-02-1_22_13_38.txt
    const [_, year, month, day, hour, minute, second] = fileName.split(/[-_]/);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // Fetch timeline data when outputPath or lastRun changes
  useEffect(() => {
    fetchRunTimes(outputPath);
  }, [outputPath, lastRun]);

  // Fetch timeline data when selectedRunTime changes
  useEffect(() => {
    if (selectedRunTime) {
      fetchTimelineData(outputPath, selectedRunTime);
    }
  }, [selectedRunTime]);

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{
        padding: '10px',
        margin: '10px',
        backgroundColor: '#EEE',
        alignSelf: 'flex-start',
      }}
      align="left"
      color="white"
      >
        <TextField
          id="run-time"
          label="Select Run Time"
          size="small"
          select
          value={selectedRunTime || ""}
          onChange={(event) => setSelectedRunTime(event.target.value)}
          variant="outlined"
          color="primary"
          sx={{ width: '400px' }}
          disabled={runTimes.length === 0}
          error={runTimes.length === 0}
          helperText={runTimes.length === 0 ? "No run times found" : ""}
        >
          {runTimes.map((runTime, index) => (
            <MenuItem key={runTime} value={runTime}>
              {index === 0 ? "Latest Run" : formatRunTime(runTime)}
            </MenuItem>
          ))}
        </TextField>
      </Paper>
      <Accordion
        disabled={selectedRunTime === undefined}
        expanded={timelineOpen}
        sx={{
          width: '100%',
          margin: '10px',
          backgroundColor: theme.palette.secondary.main,
          color: '#eee'
         }}
      >
        <AccordionSummary expandIcon={
          <ExpandMoreIcon
            sx={{ color: 'white' }}
            onClick={() => setTimelineOpen(!timelineOpen)}
          />
        }>
          <Typography variant="h5" fontWeight="bold">Top schedule</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              backgroundColor: '#eee',
              borderRadius: '5px',
              padding: '20px',
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary.main" mb={1} align="left">
              Schedule value: {scheduleValue}
            </Typography>
            <Timeline
              ref={timelineRef}
              options={timelineOptions}
              initialItems={timelineItems}
              initialGroups={timelineGroups}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}