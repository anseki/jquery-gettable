/*
 * jQuery.getTable
 * https://anseki.github.io/jquery-gettable/
 *
 * Copyright (c) 2015 anseki
 * Licensed under the MIT license.
 */

;(function($, undefined) {
'use strict';

var APP_NAME = 'getTable',
  tables = []; // array of reference table

function parseTable(jq, index) {
  var table = {rows: [], cols: [], cells: []},
    iTable = typeof index === 'number' ? index : tables.length,
    iColMax = -1, skip = {}, // {N<iRow>: {N<iCol>: B}}

    elmTable = jq.get(0).nodeName.toLowerCase() === 'table' ? jq.get(0) :
      (function() {
        var elm = jq.closest('table');
        return elm.length ? elm.get(0) : undefined;
      })();
  if (!elmTable) { return; }

  table.elm = elmTable;
  $(elmTable).data(APP_NAME, 'table:' + iTable);

  function getRow(index) {
    var i;
    if (!table.rows[index]) {
      for (i = 0; i <= index; i++)
        { table.rows[i] = table.rows[i] || {cells: [], table: table}; }
    }
    return table.rows[index];
  }
  function getCol(index) {
    var i;
    if (!table.cols[index]) {
      for (i = 0; i <= index; i++)
        { table.cols[i] = table.cols[i] || {cells: [], table: table}; }
    }
    return table.cols[index];
  }

  $.each(elmTable.rows, function(iRow, elmRow) {
    var row, col, cell, iCol, iCell = 0, elmCell, exRows, exCols, i, j;
    $(elmRow).data(APP_NAME, 'table:' + iTable + ',row:' + iRow);

    (function() {
      var colsLen = 0;
      $.each(elmRow.cells, function(i, cell) { colsLen += +cell.colSpan || 1; });
      if (colsLen - 1 > iColMax) { iColMax = colsLen - 1; }
    })();

    for (iCol = 0; iCol <= iColMax; iCol++) {
      if (skip[iRow] && skip[iRow][iCol]) { continue; }
      if (elmCell = elmRow.cells[iCell++]) {
        $(elmCell).data(APP_NAME, 'table:' + iTable + ',cell:' + table.cells.length);
        cell = {elm: elmCell, rows: [], cols: [], table: table, iRow: iRow, iCol: iCol};
        // extending via colspan="0", colgroup and rowspan="0" isn't supported.
        // http://dev.w3.org/html5/spec/single-page.html#attr-tdth-colspan
        exRows = (+elmCell.rowSpan || 1) - 1;
        exCols = (+elmCell.colSpan || 1) - 1;
        for (i = 0; i <= exRows; i++) {
          row = getRow(iRow + i);
          cell.rows.push(row);
          row.cells.push(cell);
        }
        for (i = 0; i <= exCols; i++) {
          col = getCol(iCol + i);
          cell.cols.push(col);
          col.cells.push(cell);
        }
        for (i = 1; i <= exRows; i++) {
          skip[iRow + i] = skip[iRow + i] || {};
          for (j = 0; j <= exCols; j++) { skip[iRow + i][iCol + j] = true; }
        }
        iCol += exCols;
        table.cells.push(cell);
      }
    }
  });

  // cross line cells
  $.each(table.cells, function(i, cell) {
    var xCells = [cell];
    $.each(cell.rows.concat(cell.cols),
      function(i, rowCol) { uniqueConcat(xCells, rowCol.cells); });
    cell.xCells = xCells;
  });

  $.each(table.rows,
    function(i, row) { row.cells.sort(function(a, b) { return a.iCol - b.iCol; }); });
  $.each(table.cols,
    function(i, col) { col.cells.sort(function(a, b) { return a.iRow - b.iRow; }); });

  tables[iTable] = table;
  return table;
}

function uniqueConcat(arrBase, arrNew) {
  $.each(arrNew, function(i, elm) {
    if ($.inArray(elm, arrBase) < 0) { arrBase.push(elm); }
  });
}

// {table: N, row: N, cell: N}
function parseIndex(jq) {
  var index = {}, indexText = jq.data(APP_NAME) || '',
    re = /\b(\w+):(\d+)/g, matches;
  while ((matches = re.exec(indexText)) !== null) {
    index[matches[1]] = +matches[2];
  }
  return index;
}

function getParse(jq, force) {
  var iTable = parseIndex(jq).table;
  return force || typeof iTable !== 'number' || !tables[iTable] ?
    parseTable(jq, iTable) : tables[iTable];
}

function isTable(tagName) { return tagName === 'table'; }
function isRow(tagName) { return tagName === 'tr'; }
function isCell(tagName) { return tagName === 'td' || tagName === 'th'; }
function isSection(tagName) { return tagName === 'thead' || tagName === 'tfoot' || tagName === 'tbody'; }
function isAny(tagName)
  { return isTable(tagName) || isRow(tagName) || isCell(tagName) || isSection(tagName); }

// Array of cell objects -> Array of elements
function cells2Elms(cells) { return $.map(cells, function(cell) { return cell.elm; }); }
// Array of cell objects -> jQuery object
function cells2Jq(cells) { return $(cells2Elms(cells)); }

function selectCells(jq) {
  var elms = [];
  jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase(), table;
    if (isTable(tagName) && (table = getParse(that))) {
      uniqueConcat(elms, cells2Elms(table.cells));
    } else if (isRow(tagName) && (table = getParse(that))) {
      uniqueConcat(elms, cells2Elms(table.rows[parseIndex(that).row].cells));
    } else if (isCell(tagName) && (table = getParse(that))) {
      uniqueConcat(elms, [table.cells[parseIndex(that).cell].elm]); // same as that.get(0)
    } else if (isSection(tagName) && (table = getParse(that))) {
      $.each(that.get(0).rows, function(i, elmRow) {
        uniqueConcat(elms, cells2Elms(table.rows[parseIndex($(elmRow)).row].cells));
      });
    }
  });
  return $(elms.length ? elms : null);
}

function selectXCells(jq) {
  var elms = [];
  jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase(), table;
    if (isCell(tagName) && (table = getParse(that))) {
      uniqueConcat(elms, cells2Elms(table.cells[parseIndex(that).cell].xCells));
    }
  });
  return $(elms.length ? elms : null);
}

function selectRows(jq) {
  return $.map(selectRowsArray(jq), function(row) { return cells2Jq(row.cells); });
}

function selectRowsCells(jq) {
  var elms = [];
  $.each(selectRowsArray(jq),
    function(i, row) { uniqueConcat(elms, cells2Elms(row.cells)); });
  return $(elms.length ? elms : null);
}

function selectRowsArray(jq) {
  var rows = [];
  jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase(), table;
    if (isTable(tagName) && (table = getParse(that))) {
      uniqueConcat(rows, table.rows);
    } else if (isRow(tagName) && (table = getParse(that))) {
      uniqueConcat(rows, [table.rows[parseIndex(that).row]]);
    } else if (isCell(tagName) && (table = getParse(that))) {
      uniqueConcat(rows, table.cells[parseIndex(that).cell].rows);
    } else if (isSection(tagName) && (table = getParse(that))) {
      uniqueConcat(rows, $.map(that.get(0).rows, function(elmRow)
        { return table.rows[parseIndex($(elmRow)).row]; }));
    }
  });
  return rows;
}

function selectCols(jq) {
  return $.map(selectColsArray(jq), function(col) { return cells2Jq(col.cells); });
}

function selectColsCells(jq) {
  var elms = [];
  $.each(selectColsArray(jq),
    function(i, col) { uniqueConcat(elms, cells2Elms(col.cells)); });
  return $(elms.length ? elms : null);
}

function selectColsArray(jq) {
  var cols = [];
  jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase(), table;
    if ((isTable(tagName) || isRow(tagName) || isSection(tagName)) &&
        (table = getParse(that))) {
      uniqueConcat(cols, table.cols);
    } else if (isCell(tagName) && (table = getParse(that))) {
      uniqueConcat(cols, table.cells[parseIndex(that).cell].cols);
    }
  });
  return cols;
}

function selectTable(jq) {
  var elms = [];
  jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase(), table;
    if (isAny(tagName) && (table = getParse(that))) {
      uniqueConcat(elms, [table.elm]); // same as that.get(0)
    }
  });
  return $(elms.length ? elms : null);
}

function reParse(jq) {
  return jq.each(function() {
    var that = $(this), tagName = that.get(0).nodeName.toLowerCase();
    if (isAny(tagName)) { getParse(that, true); }
  });
}

$.fn[APP_NAME] = function(action) {
  return (
    action === 'cells' ?      selectCells(this) :
    action === 'xCells' ?     selectXCells(this) :
    action === 'rows' ?       selectRows(this) :
    action === 'rowsCells' ?  selectRowsCells(this) :
    action === 'cols' ?       selectCols(this) :
    action === 'colsCells' ?  selectColsCells(this) :
    action === 'table' ?      selectTable(this) :
                              reParse(this));
};

})(jQuery);
