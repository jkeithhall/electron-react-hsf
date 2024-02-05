export default function downloadBlob(blob, fileName) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger the click event
  link.click();

  // Remove the link from the body
  document.body.removeChild(link);
}