const aeolusSimulationInput = {
  name: "Aeolus",
  version: 1.0,
  dependencies: {
    baseSrc: window.electronApi ? window.electronApi.baseSrc : "./output",
    modelSrc: "model.json",
    targetSrc: "targets.json",
    pythonSrc: window.electronApi ? window.electronApi.pythonSrc : "../../Horizon/samples/Aeolus/pythonScripts/",
    outputPath: window.electronApi ? window.electronApi.baseSrc : "./output"
  },
  simulationParameters: {
    startJD: 2454680.0,
    startSeconds: 0.0,
    endSeconds: 90.0,
    stepSeconds: 30
  },
  schedulerParameters: {
    maxSchedules: 10,
    cropTo: 5
  }
}
const initSimulationInput = {
  name: '',
  version: 1.0,
  dependencies: {
    baseSrc: window.electronApi ? window.electronApi.baseSrc : "./output",
    modelSrc: "model.json",
    targetSrc: "targets.json",
    pythonSrc: window.electronApi ? window.electronApi.pythonSrc : "../../Horizon/samples/Aeolus/pythonScripts/",
    outputPath: window.electronApi ? window.electronApi.baseSrc : "./output"
  },
  simulationParameters: {
    startJD: 2454680.0,
    startSeconds: 0.0,
    endSeconds: 90.0,
    stepSeconds: 30
  },
  schedulerParameters: {
    maxSchedules: 10,
    cropTo: 5
  }
}

export { aeolusSimulationInput, initSimulationInput };