Qlik Sense jquery.pivot Extension
=================================

Simple pivot Qlik Sense extension. 
The extension is using [jquery.pivot](https://github.com/janusschmidt/jquery.pivot) as base.

Check the [exmaple page](http://metalogic.dk/jquery.pivot/demo/demo.htm) to see it in action. 

Default jquery.pivot css and images are used for the extension.

Few options are provided:
* Format - custom format of the numbers. Refer to [numeraljs](http://numeraljs.com) for format examples
* Show totals - Yes/No
* Always expanded - Yes/No

What need to be added:
* OnClick - clicking on value inside the pivot table need to result as selection in Sense (possible in jquery.pivot api)
* If possible to change Totals position - Top or Bottom
* Dimension click - make selection by clicking on dimension value in the table (not provided by jquery.pivot api. need checking/implementing)

![Screenshot](https://cloud.githubusercontent.com/assets/22850/4894534/b36f2350-63d4-11e4-8a6c-6ebb6f794d69.png "Screenshot")
