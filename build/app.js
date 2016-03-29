'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileEntry = _react2.default.createClass({
  displayName: 'FileEntry',

  remove: function remove() {
    this.props.handleRemove(this.props.file);
  },
  render: function render() {
    var file = this.props.file;
    var filesize = Math.round(file.size / 1000).toString() + ' KB';
    return _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        'td',
        null,
        file.name
      ),
      _react2.default.createElement(
        'td',
        null,
        filesize
      ),
      _react2.default.createElement(
        'td',
        null,
        _react2.default.createElement('span', { onClick: this.remove, className: 'remove-file icon icon-cancel' })
      )
    );
  }
});

var FilesTable = _react2.default.createClass({
  displayName: 'FilesTable',

  render: function render() {
    var _this = this;

    var fileList = this.props.files.map(function (file) {
      return _react2.default.createElement(FileEntry, {
        handleRemove: _this.props.handleRemoveFile,
        key: file.name,
        file: file });
    });
    return _react2.default.createElement(
      'table',
      { className: 'table-striped' },
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            'File Name'
          ),
          _react2.default.createElement(
            'th',
            null,
            'Size'
          ),
          _react2.default.createElement(
            'th',
            null,
            'Remove'
          )
        )
      ),
      _react2.default.createElement(
        'tbody',
        null,
        fileList
      )
    );
  }
});

var SpreadsheetEntry = _react2.default.createClass({
  displayName: 'SpreadsheetEntry',

  render: function render() {
    var spreadsheet = this.props.spreadsheet;
    return _react2.default.createElement(
      'li',
      { className: 'list-group-item' },
      _react2.default.createElement('span', { className: 'media-object pull-left icon icon-doc-text' }),
      _react2.default.createElement(
        'div',
        { className: 'media-body' },
        _react2.default.createElement(
          'strong',
          null,
          spreadsheet.name
        ),
        _react2.default.createElement(
          'p',
          null,
          spreadsheet.size
        )
      )
    );
  }
});

var SpreadsheetList = _react2.default.createClass({
  displayName: 'SpreadsheetList',

  render: function render() {
    var rendered = _react2.default.createElement(
      'p',
      null,
      'No spreadsheets have been compiled.'
    );
    var spreadsheets = this.props.spreadsheets;
    if (spreadsheets.length) {
      rendered = _react2.default.createElement(
        'ul',
        { className: 'list-group' },
        spreadsheets.map(function (spreadsheet) {
          return _react2.default.createElement(SpreadsheetEntry, { key: spreadsheet.id, spreadsheet: spreadsheet });
        })
      );
    }
    return rendered;
  }
});

var SpreadsheetSidebar = _react2.default.createClass({
  displayName: 'SpreadsheetSidebar',

  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'pane-sm sidebar padded-more' },
      _react2.default.createElement(SpreadsheetList, { spreadsheets: this.props.spreadsheets })
    );
  }
});

var FilesForm = _react2.default.createClass({
  displayName: 'FilesForm',

  openFileDialog: function openFileDialog() {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Spreadsheets', extensions: ['xlsx'] }]
    }, this.props.handleFilesChoose);
  },
  doSubmit: function doSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.handleSubmit(e);
  },
  render: function render() {
    return _react2.default.createElement(
      'form',
      { action: '#', onSubmit: this.doSubmit },
      _react2.default.createElement(
        'div',
        { className: 'form-group' },
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-primary',
            type: 'button',
            onClick: this.openFileDialog },
          'Add Files'
        ),
        _react2.default.createElement(
          'button',
          { className: 'btn btn-positive', type: 'submit' },
          'Compile'
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-negative',
            type: 'button',
            onClick: this.props.handleRemoveAll },
          'Remove All'
        )
      )
    );
  }
});

var FilesMenu = _react2.default.createClass({
  displayName: 'FilesMenu',

  addFiles: function addFiles(filenames) {
    var _this2 = this;

    var promises = filenames.map(statFile);
    Promise.all(promises).then(function (stats) {
      _this2.props.handleFilesAdded(stats);
    }).catch(function (err) {
      alert(err);
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'pane padded-more' },
      _react2.default.createElement(
        'p',
        { className: 'instructions' },
        'Click the button below to select the spreadsheet files that you wish to compile into a single spreadsheet.  Once selected, you can click the compile button and choose a destination for your compiled spreadsheet.  All spreadsheets compiled in this session will appear in the list on the left.'
      ),
      _react2.default.createElement(
        'div',
        { className: 'form-group' },
        _react2.default.createElement(FilesTable, {
          handleRemoveFile: this.props.handleRemoveFile,
          files: this.props.files })
      ),
      _react2.default.createElement(FilesForm, {
        handleFilesChoose: this.addFiles,
        handleSubmit: this.props.handleCompile })
    );
  }
});

var SpreadsheetCompiler = _react2.default.createClass({
  displayName: 'SpreadsheetCompiler',

  getInitialState: function getInitialState() {
    return {
      files: [],
      spreadsheets: []
    };
  },
  removeFile: function removeFile(file) {
    var idx = this.state.files.indexOf(file);
    this.state.files.splice(idx, 1);
    this.setState({ files: this.state.files });
  },
  addFiles: function addFiles(files) {
    this.setState({
      files: this.state.files.concat(files)
    });
  },
  compileSpreadsheets: function compileSpreadsheets() {
    var saved = dialog.showSaveDialog({
      filters: [{ name: 'Spreadsheets', extensions: ['xlsx'] }]
    });
    var files = this.state.files.slice(0);
    var sizeSum = files.reduce(function (p, v) {
      return p + v.size;
    }, 0);
    console.log(sizeSum);
    var spreadsheet = {
      name: saved,
      size: Math.round(sizeSum / 1000).toString() + ' KB',
      id: this.state.spreadsheets.length
    };
    this.setState({
      spreadsheets: this.state.spreadsheets.concat([spreadsheet]),
      files: []
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'pane-group' },
      _react2.default.createElement(SpreadsheetSidebar, { spreadsheets: this.state.spreadsheets }),
      _react2.default.createElement(FilesMenu, {
        handleRemoveFile: this.removeFile,
        handleFilesAdded: this.addFiles,
        files: this.state.files,
        handleCompile: this.compileSpreadsheets })
    );
  }
});

_reactDom2.default.render(_react2.default.createElement(SpreadsheetCompiler, null), document.getElementById('window-content'));

var fs = require('fs');
var path = require('path');
var remote = require('remote');
var dialog = remote.require('dialog');

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

function createSpreadsheet(filepath) {
  alert(filepath);
}

/*
fileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
});
*/
