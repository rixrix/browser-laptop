/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const electronLocalshortcut = require('electron-localshortcut')

module.exports.register = (win) => {
  // Most of these events will simply be listened to by the app store and acted
  // upon.  However sometimes there are no state changes, for example with focusing
  // the URL bar.  In those cases it's acceptable for the individual components to
  // listen to the events.
  const simpleWebContentEvents = [
    ['CmdOrCtrl+L', 'shortcut-focus-url'],
    ['Ctrl+Tab', 'shortcut-next-tab'],
    ['Ctrl+Shift+Tab', 'shortcut-prev-tab'],
    ['CmdOrCtrl+Shift+]', 'shortcut-next-tab'],
    ['CmdOrCtrl+Shift+[', 'shortcut-prev-tab'],
    ['CmdOrCtrl+9', 'shortcut-set-active-frame-to-last'],
    ['CmdOrCtrl+Shift+T', 'shortcut-undo-closed-frame'],
    ['Escape', 'shortcut-active-frame-stop'],
    ['CmdOrCtrl+R', 'shortcut-active-frame-reload'],
    ['CmdOrCtrl+=', 'shortcut-active-frame-zoom-in'],
    ['CmdOrCtrl+-', 'shortcut-active-frame-zoom-out'],
    ['CmdOrCtrl+0', 'shortcut-active-frame-zoom-reset'],
    ['CmdOrCtrl+Alt+I', 'shortcut-active-frame-toggle-dev-tools']
  ]

  // Tab ordering shortcuts
  Array.from(new Array(8), (x, i) => i).reduce((list, i) => {
    list.push(['CmdOrCtrl+' + String(i + 1), 'shortcut-set-active-frame-by-index', i])
    return list
  }, simpleWebContentEvents)

  simpleWebContentEvents.forEach((shortcutEventName) =>
    electronLocalshortcut.register(win, shortcutEventName[0], () => {
      BrowserWindow.getFocusedWindow().webContents.send(shortcutEventName[1], shortcutEventName[2])
    }))

  electronLocalshortcut.register(win, 'CmdOrCtrl+Shift+J', () => {
    BrowserWindow.getFocusedWindow().toggleDevTools()
  })
}

module.exports.unregister = (win) => {
  electronLocalshortcut.unregisterAll(win)
}