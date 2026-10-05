/**
 * Saves text as a file through the browser's download mechanism.
 *
 * The text is wrapped in a Blob and linked through an object URL, which,
 * unlike a data URI, has no length limit and keeps the declared charset.
 *
 * @param {string} contents File contents.
 * @param {string} fileName Suggested name of the downloaded file.
 * @param {string} [mimeType] Media type, including the charset.
 */
export function downloadTextFile(contents, fileName, mimeType = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoke on the next tick so the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
