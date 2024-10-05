import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Timeline from 'react18-vis-timeline';

import formatTimeline from '../utils/formatTimeline';

export default function Analyze({ outputPath, startJD }) {
  const [loading, setLoading] = useState(true);
  const [scheduleValue, setScheduleValue] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timelineItems, setTimelineItems] = useState([]);
  const [timelineGroups, setTimelineGroups] = useState([]);
  const [timelineOptions, setTimelineOptions] = useState({});

  function fetchTimelineData(outputPath) {
    if (window.electronApi) {
      window.electronApi.fetchTimelineData(outputPath, (content) => {
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
          setStartTime(startTime);
          setEndTime(endTime);
          setTimelineItems(items);
          setTimelineGroups(groups);
          setTimelineOptions({
            width: "100%",
            height: "200px",
            align: "left",
            showTooltips: true,
            timeAxis: {scale: 'second', step: 5}
          })
          setLoading(false);
        } catch (error) {
          console.error("Error while fetching timeline data:", error);
        }
      });
    }
  }

  useEffect(() => {
    if (outputPath) {
      console.log("Fetching timeline data for outputPath:", outputPath);
      fetchTimelineData(outputPath);
    }
  }, [outputPath]);

  return (
    <Paper elevation={3} sx={{ backgroundColor: '#282D3D', padding: '20px', width: "100%", height: 400, borderRadius: "5px" }}>
      {!loading &&
        <>
          <Typography variant="h3" color='light.main' mt={1} mb={1.5}>Top Schedule</Typography>
          <Timeline options={timelineOptions} initialItems={timelineItems} initialGroups={timelineGroups} />
        </>}
    </Paper>
  );
}
