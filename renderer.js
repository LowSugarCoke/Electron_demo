// Electron modules
const { ipcRenderer } = require('electron')

// Declare a variable to store the selected directory
let selectedDirectory = null

// Listen for 'click' events on the 'chooseButton' button
document.getElementById('chooseButton').addEventListener('click', () => {
  // Send a 'open-file-dialog' message to the main process
  ipcRenderer.send('open-file-dialog')
})

// Listen for 'directory-selected' messages from the main process
ipcRenderer.on('directory-selected', (event, path) => {
  // Store the selected directory
  selectedDirectory = path
})

// Listen for 'click' events on the 'runButton' button
document.getElementById('runButton').addEventListener('click', () => {
  // Send a 'run-python-script' message to the main process with the selected directory
  ipcRenderer.send('run-python-script', selectedDirectory)
})
