// TO DO: Make sure file is in the correct directory
function validatePythonFile(pythonDirectoryPath, filePath) {
  return filePath.startsWith(pythonDirectoryPath);
}

function findInvalidPythonFiles(pythonDirectoryPath, filePaths) {
  return filePaths.filter(
    (file) => !validatePythonFile(pythonDirectoryPath, file),
  );
}

export { findInvalidPythonFiles, validatePythonFile };
