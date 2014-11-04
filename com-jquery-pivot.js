define(["jquery","text!./stylesheet.css", "./jquery.pivot.min", "./numeral"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 1500
						},
						Pivot: {
							type: "items",
							label: "jquery.pivot options" ,
							items: {
    						Format : {
    							ref: "format",
    							label: "Format (using http://numeraljs.com)",
    							type: "string",
    							defaultValue: "0,0.00",
    						},
    						Totals : {
    							ref: "showtotals",
    							label: "Show totals",
    							type: "boolean",
    							defaultValue: true,
    							component: "switch",
      						options: [ {
      							value: true,
      							label: "On"
      						}, {
      							value: false,
      							label: "Off"
      						} ],
    						},
    						Collapsible : {
    							ref: "collapsible",
    							label: "Collapsible",
    							type: "boolean",
    							defaultValue: true,
    							component: "switch",
      						options: [ {
      							value: true,
      							label: "On"
      						}, {
      							value: false,
      							label: "Off"
      						} ],
    						}
              }
            }
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			//var colors = Highcharts.getOptions().colors;
			var id = "div_" + layout.qInfo.qId;
			$element.html( '<div id="' + id + '"></div>' );

      var d = 0;
      var c = 0;
      var columns = [];
      var rows = [];
      
      if( layout.qHyperCube.qDimensionInfo.length > 1) {
        for(c = 0; c < layout.qHyperCube.qDimensionInfo.length; c++) {
          var column = layout.qHyperCube.qDimensionInfo[c];
          column = { colvalue: column.qFallbackTitle.replace(' ', ''), coltext: column.qFallbackTitle.replace(' ', ''), header: column.qFallbackTitle.replace(' ', ''), sortbycol: column.qFallbackTitle.replace(' ', ''), result: false };
          if( c === 0) {
            column.pivot = true;
            column.groupbyrank = null;
          } else {
            column.pivot = false;
            column.groupbyrank = c;
          }
          columns.push(column);
        }
      } else {
        columns.push({ colvalue: "Total1", coltext: "Total1", header: "Total1", sortbycol: "Total1", result: false, pivot: true, groupbyrank: null });
        var column = layout.qHyperCube.qDimensionInfo[0];
        column = { colvalue: column.qFallbackTitle.replace(' ', ''), coltext: column.qFallbackTitle.replace(' ', ''), header: column.qFallbackTitle.replace(' ', ''), sortbycol: column.qFallbackTitle.replace(' ', ''), result: false, groupbyrank : 1 };
        columns.push(column);
      }
      
      var lastMeasure = {};
      lastMeasure.colvalue = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle.replace(' ', '');
      lastMeasure.coltext = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle.replace(' ', '');
      lastMeasure.header = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle.replace(' ', '');
      lastMeasure.sortbycol = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle.replace(' ', '');
      lastMeasure.result = true;
      lastMeasure.pivot = false;
      lastMeasure.groupbyrank = null;
      columns.push(lastMeasure);
      
      for(d = 0; d < qMatrix.length; d++) {
          var row = qMatrix[d];
          var row1 = {};
          
          if( layout.qHyperCube.qDimensionInfo.length > 1) {
            for(var co = 0; co < columns.length; co++) {
              row1[columns[co].coltext] = row[co].qText.replace(' ', '');
            }
          } else {
            row1[columns[1].coltext] = row[0].qText.replace(' ', '');
          }

          row1[layout.qHyperCube.qMeasureInfo[0].qFallbackTitle] = row[row.length-1].qText;
          rows.push(row1);
      }

      var JSONdata = {
          dataid: "An optional sourcetable identifier",
          columns: columns,
          rows: rows
      };

    $('#'+id).pivot({
        source: JSONdata,
        formatFunc: function (n) { return numeral(n).format(layout.format) }, //jQuery.fn.pivot.formatUK(n, parseInt(layout.decimals)); },
        bTotals: layout.showtotals,              // Option
        bCollapsible: layout.collapsible,         // Option
        noGroupByText: "No value",  // Option
        noDataText: "No data",      // Option
        onResultCellClicked: function (data) {
          var a = '{' + dumpObj(data, "data") + '}';
          console.log(JSON.parse(a));
        },
        sortPivotColumnHeaders:false
    });

    function dumpObj(obj, name, depth) {
        if (typeof depth === "undefined") { depth = 1; }
        var indentTpl = '    ', indent = '', MAX_DUMP_DEPTH = 10, propertyStrings = [], child = null, i, item, output;

        for (i = 0; i < depth; i += 1) {
            indent += indentTpl;
        }

        if (depth > MAX_DUMP_DEPTH) {
            return indent + '"' + name + '"' + ': <Maximum Depth Reached>\n';
        }
        if (typeof obj === 'object') {
            output = indent + '"' + name + '"' + ' : {\n';
            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    try  {
                        child = obj[item];
                    } catch (e) {
                        child = '<Unable to Evaluate>';
                    }
                    if (typeof child === 'object') {
                        propertyStrings.push(dumpObj(child, item, depth + 1));
                    } else {
                        propertyStrings.push(indent + indentTpl +  '"' + item + '"' + ': ' + (typeof child === 'string' ? '"' + child + '"' : child));
                    }
                }
            }
            output += propertyStrings.join(', \n') + '}';
            return output;
        } else if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return obj;
        }
    }
}};


});