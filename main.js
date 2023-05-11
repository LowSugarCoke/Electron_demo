// Electron modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron')

// Node.js modules
const path = require('path')
const { spawn } = require('child_process')

// Declare the window object globally, so it won't be garbage collected
let win = null

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // allows renderer processes to use `require`
      contextIsolation: false // allows renderer processes to use `ipcRenderer`
    }
  })

  // Load the index.html file into our BrowserWindow
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// Listen for 'open-file-dialog' messages from the renderer process
ipcMain.on('open-file-dialog', (event) => {
  // Show an open directory dialog and reply with the selected directory
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      // Send the selected directory back to the renderer process
      event.reply('directory-selected', result.filePaths[0])
    }
  }).catch(err => {
    console.log(err)
  })
})

// Listen for 'run-python-script' messages from the renderer process
ipcMain.on('run-python-script', (event, arg) => {
  // Run the Python script with the selected directory as an argument
  const python = spawn('python', [path.join(__dirname, 'script.py'), arg])

  // Print the Python script's output
  python.stdout.on('data', function (data) {
    console.log('Python response:', data.toString())
  })
})
