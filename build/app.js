'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var remote = require('remote');
  var dialog = remote.require('dialog');

  var filesTable = document.getElementById('files-table');
  var tbody = filesTable.querySelector('tbody');

  function statFile(filepath) {
    return new Promise(function (resolve, reject) {
      fs.stat(filepath, function (err, stats) {
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
    var row = document.createElement('tr');
    var filename = document.createElement('td');
    filename.innerHTML = file.name;
    var filesize = document.createElement('td');
    filesize.innerHTML = Math.round(file.size / 1000).toString() + ' KB';
    row.appendChild(filename);
    row.appendChild(filesize);
    tbody.appendChild(row);
  }

  function updateTable(filenames) {
    tbody.innerHTML = '';
    var promises = filenames.map(statFile);
    Promise.all(promises).then(function (stats) {
      stats.forEach(addToTable);
    }).catch(function (err) {
      alert(err);
    });
  }

  function createSpreadsheet(filepath) {
    alert(filepath);
  }

  var chooseButton = document.getElementById('choose');

  chooseButton.addEventListener('click', function (evt) {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Spreadsheets', extensions: ['xlsx'] }]
    }, updateTable);
  });

  var fileForm = document.getElementById('files');

  fileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var saved = dialog.showSaveDialog({
      filters: [{ name: 'Spreadsheets', extensions: ['xlsx'] }]
    }, createSpreadsheet);
  });
})();
