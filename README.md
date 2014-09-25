# getTable

The simple jQuery Plugin for easy getting table cells that is positioned on horizontal line, vertical line or both lines that passes through the target cell.

**See <a href="http://anseki.github.io/jquery-gettable">DEMO</a>**

+ getTable gets horizontal line (`row`) and vertical line (`col`) of table. And it gets cells that is positioned on those lines. The handling cells that is positioned on horizontal line is supported by `<tr>` HTML tag, but vertical line is not supported by HTML.
+ The cells that is extended by `colspan`/`rowspan` are parsed correctly. More lines pass through the extended cells (i.e. those cells catch more cells), and those cells are positioned on more lines (i.e. those cells are caught by more cells).
+ The horizontal line (`row`) and vertical line (`col`) are discerned. getTable returns a jQuery object (or Array of those), therefore you can do anything you want to those.
+ The table is parsed via DOM, it's fast, correctly, and those data are cached.

```js
// Get rows that include target cell.
rows = $('td#target').getTable('rows');

// Get cols that include target cell.
cols = $('td#target').getTable('cols');

// Get cells that is included in cross line (rows and cols) of target cell, and style those.
cells = $('td#target').getTable('xCells').css('backgroundColor', 'blue');
```

## Getting Started
Load after jQuery.

```html
<script src="jquery-1.11.0.min.js"></script>
<script src="jquery.gettable.min.js"></script>
```

## Methods

### `rows`

```js
rows = target.getTable('rows')
```

Return an Array that includes zero or more `row`s. The `row` is a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements that is positioned on a horizontal line. The `cell`s in the `row` are sorted by position as from left to right, regardless of HTML source order. For example, `row.eq(0)` is leftmost `cell` like header.  
*(If you want to do something to all `cell`s in `rows` together (you want to do nothing to each `row`s), use `rowsCells` method.)*  
The elements are selected according to the each elements that is included in current target jQuery object. The returned `rows` is one Array that includes all of those.

An element that is included in current target jQuery object is:

+ **`table`** (`<table>` element)  
All `row`s in this `table` are selected.
+ **`row`** (`<tr>` element)  
This `row` itself is selected.  
The `cell` elements in this `row` are not the same as `cell` elements in `<tr>` element, which includes `cell`s that is extended by `rowspan` in previous `<tr>`.
+ **`cell`** (`<td>` or `<th>` element)  
All `row`s that include this `cell` (i.e. horizontal lines that pass through this `cell`) are selected.  
*(If you want both `rows` and `cols` of `cell`, use `xCells` method.)*  
Example:  
```js
var hl; // keep to restore
$('td').hover(function() {
  hl = $(this).getTable('rows')[0].addClass('highlight');
}, function() {
  hl.removeClass('highlight');
});
```
+ **`section`** (`<thead>`, `<tfoot>` or `<tbody>` element)  
All `row`s in this `section` are selected.

In any cases, the nested `table` (`table` that is included in current target) is excluded (If part of the nested `table` is target too, of course it is included).

### `rowsCells`

```js
cells = target.getTable('rowsCells')
```

Return a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements that is included in all `row`s that selected by same way as `rows` method. The returned `cells` is one jQuery object that includes all of those.  
*(If you want to do something to each `row`s (you want to do nothing to all `cell`s in `rows` together), use `rows` method.)*

This is not the same as merged all `cell`s that is returned by `rows` method, `rowsCells` method returns unique `cell`s, duplicated elements are excluded.

### `cols`

```js
cols = target.getTable('cols')
```

Return an Array that includes zero or more `col`s. The `col` is a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements that is positioned on a vertical line. The `cell`s in the `col` are sorted by position as from top to bottom, regardless of HTML source order. For example, `col.eq(0)` is uppermost `cell` like header.  
*(If you want to do something to all `cell`s in `cols` together (you want to do nothing to each `col`s), use `colsCells` method.)*  
The elements are selected according to the each elements that is included in current target jQuery object. The returned `cols` is one Array that includes all of those.

An element that is included in current target jQuery object is:

+ **`table`, `row`, `section`** (`<table>`, `<tr>`, `<thead>`, `<tfoot>` or `<tbody>` element)  
All `col`s in this `table` are selected.
+ **`cell`** (`<td>` or `<th>` element)  
All `col`s that include this `cell` (i.e. vertical lines that pass through this `cell`) are selected.  
*(If you want both `rows` and `cols` of `cell`, use `xCells` method.)*  
Example:  
```js
var hl; // keep to restore
$('td').hover(function() {
  hl = $(this).getTable('cols')[0].addClass('highlight');
}, function() {
  hl.removeClass('highlight');
});
```

In any cases, the nested `table` (`table` that is included in current target) is excluded (If part of the nested `table` is target too, of course it is included).

### `colsCells`

```js
cells = target.getTable('colsCells')
```

Return a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements that is included in all `col`s that selected by same way as `cols` method. The returned `cells` is one jQuery object that includes all of those.  
*(If you want to do something to each `col`s (you want to do nothing to all `cell`s in `cols` together), use `cols` method.)*

This is not the same as merged all `cell`s that is returned by `cols` method, `colsCells` method returns unique `cell`s, duplicated elements are excluded.

### `cells`

```js
cells = target.getTable('cells')
```

Return a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements. The elements are selected according to the each elements that is included in current target jQuery object. The returned `cells` is one jQuery object that includes all of those.

An element that is included in current target jQuery object is:

+ **`table`** (`<table>` element)  
All `cell`s in this `table` are selected.
+ **`row`** (`<tr>` element)  
All `cell`s in this `row` are selected.  
This is not the same as `cell` elements in `<tr>` element, which includes `cell`s that is extended by `rowspan` in previous `<tr>`.  
Example:  
```js
$('#targetRow').getTable('cells').css('backgroundColor', 'blue');
```
+ **`cell`** (`<td>` or `<th>` element)  
This `cell` itself is selected.
+ **`section`** (`<thead>`, `<tfoot>` or `<tbody>` element)  
All `cell`s in this `section` are selected.

In any cases, the nested `table` (`table` that is included in current target) is excluded (If part of the nested `table` is target too, of course it is included).

### `xCells`

```js
cells = target.getTable('xCells')
```

Return a jQuery object that includes zero or more `cell` (`<td>` or `<th>`) elements that is positioned on cross line (horizontal line and vertical line) that pass through the each elements that is included in current target jQuery object. The returned `cells` is one jQuery object that includes all of those. The first `cell` of that `cells` is current target. i.e. `cells.eq(0)` is a `cell` on the cross point.  
The elements that is not `cell` (`<td>` or `<th>`) are ignored.

This is not the same as merged all `cell`s that is returned by `rows` method and `cols` method, `xCells` method returns unique `cell`s, duplicated elements are excluded.

The nested `table` (`table` that is included in current target) is excluded (If part of the nested `table` is target too, of course it is included).

Example:  
```js
var hl; // keep to restore
$('td').hover(function() {
  hl = $(this).getTable('xCells').addClass('highlight');
}, function() {
  hl.removeClass('highlight');
});
```

### `table`

```js
table = target.getTable('table')
```

Return a jQuery object that includes zero or more `table` (`<table>`) elements. The `<table>` elements that is included in current target jQuery object, and the `<table>` elements that have `<tr>`, `<td>`, `<th>`, `<thead>`, `<tfoot>` or `<tbody>` elements that is included in current target jQuery object are selected. The returned `table` is one jQuery object that includes all of those (duplicated elements are excluded).

### Initialize

```js
target.getTable()
```

Parse the table, and cache those data.  
You usually don't need to call initialize method, because getTable parses it automatically when getTable met unknown table via other methods. And getTable caches those data, therefore parsing again is not needed.  
The cases of initialize method is needed are:

+ You want to make preparations in advance.
+ You changed structure of the table that was already parsed.

If the element that is included in current target jQuery object is `<table>`, that table is parsed. If element is part of the table (`<tr>`, `<td>`, `<th>`, `<thead>`, `<tfoot>` or `<tbody>`), the table that has those parts  is parsed.
i.e. these codes below are equals:

```js
$('table#table1').getTable();
$('table#table1>tbody:eq(0)').getTable();
$('table#table1>tbody:eq(0)>tr:eq(0)').getTable();
```

getTable discern nested table correctly, therefore if `<td>` of only inner table is given, outer table is not parsed.

## Note

The cell extending by `colspan="0"` and `<colgroup>` is not supported. Now, browser that supports this is Firefox only.

## History
 * 2014-09-15			v0.2.0			Add: `rowsCells` method and `colsCells` method.
 * 2014-09-12			v0.1.0			Initial release.
