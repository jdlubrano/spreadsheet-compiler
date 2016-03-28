(function() {
  'use strict';
  const fs = require('fs');
  const path = require('path');
  const remote = require('remote');
  const dialog = remote.require('dialog');

  const filesTable = document.getElementById('files-table');
  const tbody = filesTable.querySelector('tbody');

  function statFile(filepath) {
    return new Promise((resolve, reject) => {
      fs.stat(filepath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          stats.name = path.basename(filepath);
          resolve(stats);
        }
      });
    });
  }

  function addToTable(file) {
    let row = document.createElement('tr');
    let filename = document.createElement('td');
    filename.innerHTML = file.name;
    let filesize = document.createElement('td');
    filesize.innerHTML = Math.round(file.size / 1000).toString() + ' KB';
    row.appendChild(filename);
    row.appendChild(filesize);
    tbody.appendChild(row);
  }

  function updateTable(filenames) {
    tbody.innerHTML = '';
    let promises = filenames.map(statFile);
    Promise.all(promises).then((stats) => {
      stats.forEach(addToTable);
    }).catch((err) => {
      alert(err);
    });
  }

  function createSpreadsheet(filepath) {
    alert(filepath);
  }

  let chooseButton = document.getElementById('choose');

  chooseButton.addEventListener('click', (evt) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx'] }
      ]
    }, updateTable);
  });

  let fileForm = document.getElementById('files');

  fileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    var saved = dialog.showSaveDialog({
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx'] }
      ]
    }, createSpreadsheet);
  });

}());

