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
					qHeight : 500
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
		  var self = this;
		  //console.log(self.backendApi.getRowCount());
		  var lastrow = 0;
		  var qMatrix = [];
     self.backendApi.eachDataRow( function ( rownum, row ) {
                lastrow = rownum;
                qMatrix.push(row);
                //console.log(rownum);
                //do something with the row..
     });

    if(this.backendApi.getRowCount() > lastrow +1){
               //we havent got all the rows yet, so get some more, 1000 rows
                var requestPage = [{
                      qTop: lastrow + 1,
                      qLeft: 0,
                      qWidth: 10, //should be # of columns
                      qHeight: Math.min( 1000, this.backendApi.getRowCount() - lastrow )
                  }];
                 self.backendApi.getData( requestPage ).then( function ( dataPages ) {
                          //when we get the result trigger paint again
                          //me.paint( $element );
                          //console.log(dataPages);
                          //console.log(qMatrix.length);
                          //console.log(dataPages[0].qMatrix.length);
                          qMatrix = qMatrix.concat(dataPages[0].qMatrix);
                          //console.log(qMatrix.length);
                 } );
       }


var requestPage = [{
                      qTop: 1,
                      qLeft: 0,
                      qWidth: 10, //should be # of columns
                      qHeight: Math.min( 1000, this.backendApi.getRowCount() - lastrow )
                  }];

       //self.backendApi.GetHyperCubePivotData('/qHyperCubeDef', requestPage).then(function(pages) {

       //});
       console.log(layout.qHyperCube);


     //console.log(qMatrix.length + ' ' + self.backendApi.getRowCount())

			var qMatrix1 = layout.qHyperCube.qDataPages[0].qMatrix;
			var id = "div_" + layout.qInfo.qId;
			$element.html( '<div id="' + id + '"></div><div> <input type="button" id="test" value="test"></input> </div>' );
      var qDimensionInfo = layout.qHyperCube.qDimensionInfo;
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

      var t = [];
      for(var co1 = 0; co1 < columns.length; co1++) {
        t[columns[co1].coltext] = [];
      };

      //console.log(t);

      for(d = 0; d < qMatrix.length; d++) {
          var row = qMatrix[d];
          var row1 = {};

          if( layout.qHyperCube.qDimensionInfo.length > 1) {
            for(var co = 0; co < columns.length; co++) {
               if(row[co].qText)               {
                row1[columns[co].coltext] = row[co].qText.replace(' ', '');
                t[columns[co].coltext].push({value: row[co].qText.replace(' ', ''), elem : row[co].qElemNumber});
               } else {
                 row1[columns[co].coltext] = '99';
                 t[columns[co].coltext].push({value: '99', elem : row[co].qElemNumber});
               }

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

     //console.log(qDimensionInfo);

    $('#test').click(function() {
      console.log('test');
    });

    $('#'+id).pivot({
        source: JSONdata,
        formatFunc: function (n) { return numeral(n).format(layout.format) }, //jQuery.fn.pivot.formatUK(n, parseInt(layout.decimals)); },
        bTotals: layout.showtotals,
        bCollapsible: layout.collapsible,
        noGroupByText: "No value",  // Option
        noDataText: "No data",      // Option
        onResultCellClicked: function (data) {

          var a = '{' + dumpObj(data, "data") + '}';
          a = JSON.parse(a);
          //console.log(a);
          //console.log(t);

          for(var g = 0; g < Object.keys(a.data.groups).length; g++) {
            var pivotField = a.data.groups[g].dataidGroup;
            var d = t[pivotField];
            var pivotValue = a.data.groups[g].groupbyval;
            //console.log(d);

            for(var o = 0; o < d.length; o++) {

              if(d[o].value === pivotValue) {
                var dim = [];
                dim.push(d[o].elem)


                for(var qdi = 0; qdi < qDimensionInfo.length; qdi++) {
                  var title = qDimensionInfo[qdi].qFallbackTitle.replace(' ', '');
                  if(title == pivotField) {
                    //console.log(qdi + ' ' + dim);
                    self.backendApi.selectValues(qdi, dim, false);
                    break;
                  }
                }
                break;
              }
            }
          }

          var pivotField = a.data.pivot.dataidPivot;
          var d = t[pivotField];
          var pivotValue = a.data.pivot.pivotvalue;

          for(var o = 0; o < d.length; o++) {
            //console.log(d[o].value + '===' + pivotValue + ' ' + d[o].elem )
            if(d[o].value === pivotValue) {
              var dim = [];
              dim.push(d[o].elem)

              self.backendApi.selectValues(0, [d[o].elem], false);
              break;
            }
          }
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