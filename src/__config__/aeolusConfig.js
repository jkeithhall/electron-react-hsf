
export const aeolusConfig = {
  sources: {
    name: "Aeolus",
    baseSource: "./samples/aeolus/",
    modelSource: "DSAC_Static_Mod_Scripted.xml",
    targetSource: "v2.2-300targets.xml",
    buildPath: "builds/",
    pythonSource: "pythonScripts/",
    outputPath: "none",
    version: 1.0
  },
  simulationParameters: {
      startJD: 2454680.0,
      startSeconds: 0.0,
      endSeconds: 60.0,
      primaryStepSeconds: 30
    },
  schedulerParameters: {
    maxSchedules: 10,
    cropRatio: 5
  }
}