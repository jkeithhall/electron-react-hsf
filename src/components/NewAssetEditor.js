import { useState } from "react";
import { validateComponent } from "../utils/validateComponents";

import NameField from "./PaletteComponents/NameField";
import StateData from "./PaletteComponents/StateData";
import { DynamicStateType } from "./PaletteComponents/DynamicStateType";
import { EomsType } from "./PaletteComponents/EomsType";
import IntegratorOptions from "./PaletteComponents/IntegratorOptions";
import IntegratorParameters from "./PaletteComponents/IntegratorParameters";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import { randomId } from "@mui/x-data-grid-generator";
import randomColor from "randomcolor";
const BASE_COLORS = [
  "blue",
  "green",
  "red",
  "purple",
  "orange",
  "yellow",
  "pink",
];

function rgbaToHexA(rgba, forceRemoveAlpha = true) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to togehter to a string
}

function hexToRGB(hex, alpha = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

export default function NewAssetEditor({
  componentList,
  setComponentList,
  setDependencyList,
  clipboardData,
}) {
  const [id] = useState(randomId());
  const [name, setName] = useState("");
  const [dynamicStateType, setDynamicStateType] = useState("PREDETERMINED_ECI");
  const [eomsType, setEomsType] = useState("orbitalEOMS");
  const [stateData, setStateData] = useState([0, 0, 0, 0, 0, 0]);
  const [integratorOptions, setIntegratorOptions] = useState({});
  const [integratorParameters, setIntegratorParameters] = useState([]);
  const [newNodeErrors, setNewNodeErrors] = useState({});
  const [backgroundColor, setBackgroundColor] = useState(() => {
    const hue =
      BASE_COLORS[
        componentList.filter((component) => component.parent === undefined)
          .length % BASE_COLORS.length
      ];
    return rgbaToHexA(
      randomColor({
        hue,
        luminosity: "light",
        format: "rgba",
      }),
    );
  });

  const data = {
    id,
    name,
    dynamicStateType,
    eomsType,
    stateData,
    integratorOptions,
    integratorParameters,
  };

  const updateNewComponent = (updaterFunc) => {
    // updaterFunc is a function that takes the current state (componentList) and returns an updated state (componentList of one new component)
    const [updatedData] = updaterFunc([data]);
    setName(updatedData.name);
    setDynamicStateType(updatedData.dynamicStateType);
    setEomsType(updatedData.eomsType);
    setStateData([...updatedData.stateData]);
    setIntegratorOptions({ ...updatedData.integratorOptions });
    setIntegratorParameters([...updatedData.integratorParameters]);
  };

  const handlePasteClick = () => {
    if (clipboardData) {
      const {
        name,
        dynamicStateType,
        eomsType,
        stateData,
        integratorOptions,
        integratorParameters,
      } = clipboardData;
      setName(name);
      setDynamicStateType(dynamicStateType);
      setEomsType(eomsType);
      setStateData([...stateData]);
      setIntegratorOptions({ ...integratorOptions });
      setIntegratorParameters([...integratorParameters]);

      const newComponent = {
        id,
        name,
        dynamicStateType,
        eomsType,
        stateData,
        integratorOptions,
        integratorParameters,
      };
      const newComponentList = [...componentList, newComponent];
      validateComponent(newComponent, setNewNodeErrors, newComponentList);
    }
  };

  const handleBlur = () => {
    const newComponentList = [...componentList, data];
    validateComponent(data, setNewNodeErrors, newComponentList);
  };

  const handleColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        data,
        backgroundColor: hexToRGB(backgroundColor),
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const componentKeys = [
    "id",
    "name",
    "dynamicStateType",
    "eomsType",
    "stateData",
  ];
  Object.keys(integratorOptions).forEach((key) => {
    componentKeys.push(key);
  });
  integratorParameters.forEach((parameter) => {
    componentKeys.push(parameter.key);
  });

  const currentNodeErrors = newNodeErrors[id] ? newNodeErrors[id] : {};
  const noErrors = Object.keys(currentNodeErrors).length === 0;

  return (
    <>
      <Box
        sx={{
          margin: "0 20px",
          padding: "10px",
          backgroundColor: "#eeeeee",
          borderRadius: "5px",
        }}
      >
        {clipboardData && !clipboardData.className ? (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ position: "relative", width: "100%" }}
          >
            <Typography
              variant="h4"
              color="secondary"
              mt={2}
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {"Create New Asset"}
            </Typography>
            <Box sx={{ position: "absolute", right: 0 }}>
              <Tooltip title="Paste from clipboard">
                <IconButton
                  onClick={handlePasteClick}
                  color="secondary"
                  size="small"
                >
                  <ContentPasteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        ) : (
          <Typography variant="h4" color="secondary" mt={2}>
            {"Create New Asset"}
          </Typography>
        )}
        <NameField
          name={name}
          setComponentList={updateNewComponent}
          id={id}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        <Grid container spacing={2}>
          <DynamicStateType
            value={dynamicStateType}
            setComponentList={updateNewComponent}
            id={id}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <EomsType
            value={eomsType}
            setComponentList={updateNewComponent}
            id={id}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
        </Grid>
        <StateData
          stateData={stateData}
          id={id}
          setComponentList={updateNewComponent}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        <IntegratorOptions
          integratorOptions={integratorOptions}
          id={id}
          setComponentList={updateNewComponent}
          errors={currentNodeErrors}
          componentKeys={componentKeys}
          handleBlur={handleBlur}
        />
        <IntegratorParameters
          integratorParameters={integratorParameters}
          id={id}
          setComponentList={updateNewComponent}
          errors={currentNodeErrors}
          componentKeys={componentKeys}
          handleBlur={handleBlur}
        />
      </Box>
      <div className="drag-drop-container" style={{ marginBottom: 120 }}>
        {name && noErrors && (
          <>
            <Typography variant="body2" color="light" mt={2}>
              {"Drag and drop this asset into the model."}
            </Typography>
            <div className="new-node-origin">
              <Card
                sx={{
                  marginRight: "20px",
                  padding: "10px",
                  backgroundColor,
                  borderRadius: "5px",
                  height: 50,
                  width: 200,
                  cursor: "grab",
                }}
                onDragStart={handleDragStart}
                draggable
              >
                <Typography variant="h6" color="secondary">
                  {name}
                </Typography>
              </Card>
              <input
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  marginRight: "20px",
                }}
                type="color"
                onChange={handleColorChange}
                defaultValue={backgroundColor}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
