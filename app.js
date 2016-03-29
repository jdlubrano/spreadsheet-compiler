'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var FileEntry = React.createClass({
  render: function() {
    var file = this.props.file;
    var filesize = Math.round(file.size / 1000).toString() + ' KB';
    return (
      <tr>
        <td>{file.name}</td>
        <td>{filesize}</td>
        <td></td>
      </tr>
    );
  }
});

var FilesTable = React.createClass({
  render: function() {
    var fileList = this.props.files.map(function(file) {
      return <FileEntry key={file.name} file={file}></FileEntry>;
    });
    return (
      <table className="table-striped">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {fileList}
        </tbody>
      </table>
    );
  }
});

var SpreadsheetSidebar = React.createClass({
  render: function() {
    return(
      <div className="pane-sm sidebar padded-more">
        <p>No spreadsheets have been compiled</p>
      </div>
    );
  }
});

var FilesForm = React.createClass({
  openFileDialog: function() {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx'] }
      ]
    }, this.props.handleFilesChoose);
  },
  doSubmit: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.handleSubmit(e);
  },
  render: function() {
    return (
      <form action="#" onSubmit={this.doSubmit}>
        <div className="form-group">
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.openFileDialog}>Add Files</button>
          <button className="btn btn-positive" type="submit">Compile</button>
          <button
            className="btn btn-negative"
            type="button"
            onClick={this.props.handleRemoveAll}>Remove All</button>
        </div>
      </form>
    );
  }
});

var FilesMenu = React.createClass({
  addFiles: function(filenames) {
    let promises = filenames.map(statFile);
    Promise.all(promises).then((stats) => {
      this.props.handleFilesAdded(stats);
    }).catch((err) => {
      alert(err);
    });
  },
  render: function() {
    return (
      <div className="pane padded-more">
        <p className="instructions">
          Click the button below to select the spreadsheet files that
          you wish to compile into a single spreadsheet.  Once selected,
          you can click the compile button and choose a destination for
          your compiled spreadsheet.  All spreadsheets compiled in this
          session will appear in the list on the left.
        </p>
        <div className="form-group">
          <FilesTable files={this.props.files} />
        </div>
        <FilesForm
          handleFilesChoose={this.addFiles}
          handleSubmit={this.props.handleCompile} />
      </div>
    );
  }
});

var SpreadsheetCompiler = React.createClass({
  getInitialState: function() {
    return {
      files: [],
      spreadsheets: []
    };
  },
  updateFiles: function(files) {
    this.setState({ files: files });
  },
  compileSpreadsheets: function() {
    alert('compiling');
  },
  render: function() {
    return (
      <div className="pane-group">
        <SpreadsheetSidebar spreadsheets={this.state.spreadsheets} />
        <FilesMenu
          handleFilesAdded={this.updateFiles}
          files={this.state.files}
          handleCompile={this.compileSpreadsheets} />
      </div>
    );
  }
});

ReactDOM.render(
  <SpreadsheetCompiler />,
  document.getElementById('window-content')
);

const fs = require('fs');
const path = require('path');
const remote = require('remote');
const dialog = remote.require('dialog');

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

function createSpreadsheet(filepath) {
  alert(filepath);
}

/*
fileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  var saved = dialog.showSaveDialog({
    filters: [
      { name: 'Spreadsheets', extensions: ['xlsx'] }
    ]
  }, createSpreadsheet);
});
*/

