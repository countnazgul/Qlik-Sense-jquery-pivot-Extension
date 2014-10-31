$(document).ready(function () {

  var example4JSONdata = {
      dataid: "An optional sourcetable identifier",
      columns: [
          { colvalue: "Month ", coltext: "Month ", header: "Month ", sortbycol: "Month ", groupbyrank: null, pivot: true, result: false },
          { colvalue: "Subject ", coltext: "Subject ", header: "Subject ", sortbycol: "Subject ", groupbyrank: 2, pivot: false, result: false },
          { colvalue: "Student ", coltext: "Student ", header: "Student ", sortbycol: "Student ", dataid: "An optional id.", groupbyrank: 1, pivot: false, result: false },
          { colvalue: "Score ", coltext: "Score ", header: "Score ", sortbycol: "Score ", groupbyrank: null, pivot: false, result: true}],
      rows: [
          { "Month ": "January", "Subject ": "English", "Student ": "Elisa", "Score ": "8.7" },
          { "Month ": "January ", "Subject ": "Maths ", "Student ": "Elisa ", "Score ": "6.5 " },
          { "Month ": "January ", "Subject ": "Science ", "Student ": "Elisa ", "Score ": "5.8 " },
          { "Month ": "March ", "Subject ": "History ", "Student ": "Mary ", "Score ": "6.7 " },
          { "Month ": "March ", "Subject ": "French ", "Student ": "Mary ", "Score ": "9.0 "}]
  };



    $('#res').pivot({
        source: example4JSONdata,
        //formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
        onResultCellClicked: function (data) {
          var a = '{' + dumpObj(data, "data") + '}';

          console.log(JSON.parse(a));
        },
        sortPivotColumnHeaders:false //we want months non sorted to get them in the right order.
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



});