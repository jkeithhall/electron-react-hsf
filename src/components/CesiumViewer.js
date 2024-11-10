import { useEffect, useState } from 'react';
import { Ion } from 'cesium';
import { Viewer, CzmlDataSource, Clock, Globe } from "resium";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZTUwYjViMy1jZGJlLTRkNDctYjU0Yi1hYTkxMzNmOTE3YjkiLCJpZCI6MjQ3MjY5LCJpYXQiOjE3Mjg2MDY4MDV9.KIky_Gm2xOVO2RkSUOiVDs8e_50JdBaJiosVa_brl04';

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

export default function CesiumViewer({czmlData, handleClockTick}) {
  const [shadowsEnabled, setShadowsEnabled] = useState(false);

  useEffect(() => {
    // Poll for the element to exist in the DOM
    const interval = setInterval(() => {
      const toolbar = document.querySelector("div.cesium-viewer-toolbar");
      const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");

      // When toolbar and modeButton exist, add the button and clear the interval
      if (toolbar && modeButton) {
        const myButton = document.createElement("button");
        myButton.classList.add("cesium-button", "cesium-toolbar-button");
        myButton.style.padding = "2px";
        myButton.title = "Toggle day/night"; // Tooltip attribute

        // Set SVG as innerHTML
        myButton.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="100%" height="100%"
            fill="currentColor"
            style"display: block;"
          >
            <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6"></path>
          </svg>
        `;

        toolbar.insertBefore(myButton, modeButton);

        // Add click listener to toggle shadowsEnabled state
        myButton.addEventListener("click", () => {
          setShadowsEnabled((prevState) => {
            console.log(`Setting shadows to ${!prevState}`);
            return !prevState;
          });
        });

        // Clear interval since the button has been added
        clearInterval(interval);

        // Cleanup function to remove button and event listener on unmount
        return () => {
          myButton.removeEventListener("click", () => setShadowsEnabled(!shadowsEnabled));
          myButton.remove();
        };
      }
    }, 100); // Check every 100ms

    // Clear the interval if the component unmounts before finding the toolbar
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Viewer fullscreenButton={false}>
      {/* CzmlDataSource must have a unique key for each data source to rerender appropriately. */}
      <CzmlDataSource data={czmlData} key={czmlData[0].name} />
      <Clock onTick={throttle(handleClockTick, 100)} />
      <Globe enableLighting={shadowsEnabled} key={shadowsEnabled}/>
    </Viewer>
  )
}