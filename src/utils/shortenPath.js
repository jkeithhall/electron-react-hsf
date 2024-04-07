function getDirectorySeparator() {
  if (window.electronApi) {
    return window.electronApi.directorySeparator;
  }
  const userAgent = navigator.userAgent;
  return userAgent.indexOf('Windows') !== -1 ? '\\' : '/';
}

function shortenPath(path, maxLength) {
  if (path === undefined) return path;
  if (path.length < maxLength) return path;

  const directorySeparator = getDirectorySeparator();
  const parts = path.split(directorySeparator);
  let shortenedPath = path;
  while (shortenedPath.length > maxLength) {
    parts.shift();
    shortenedPath = '...' + directorySeparator + parts.join(directorySeparator);
  }
  return shortenedPath;
}

export { shortenPath, getDirectorySeparator };