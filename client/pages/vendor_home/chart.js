// JavaScript Document
// Load the Visualization API and the piechart package.

       google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {

  var cat_data = google.visualization.arrayToDataTable([
    ['Month', 'Views', 'Quoters', 'Orders'],
    ['Jan',  10,      5, 2],
    ['Feb',  9,      5,2],
    ['Mar',  13,       5,4],
    ['Apr',  14,      5,1],
	['May',  12,       3,1],
	['Jun',  7,       1,0],
	['Jul',  4,       1,0],
	['Aug',  2,       0,0],
	['Sep',  13,       5,4],
	['Oct',  14,       2,2],
	['Nov',  12,       3,1],
	['Dec',  10,       9,5],
  ]);

 var photo_data = google.visualization.arrayToDataTable([
    ['Month', 'Views', 'Quoters', 'Orders'],
    ['Jan',  7,      5, 2],
    ['Feb',  9,      5,2],
    ['Mar',  7,       5,4],
    ['Apr',  14,      5,1],
	['May',  7,       3,1],
	['Jun',  7,       1,0],
	['Jul',  4,       1,0],
	['Aug',  2,       0,0],
	['Sep',  5,       5,4],
	['Oct',  4,       2,2],
	['Nov',  3,       3,1],
	['Dec',  6,       5,5],
  ]);

  var options = {
    title: 'Profile Traffic',
    hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
  };

  var catering_chart = new google.visualization.ColumnChart(document.getElementById('catering_chart_div'));
    var photo_chart = new google.visualization.ColumnChart(document.getElementById('photo_chart_div'));

  catering_chart.draw(cat_data, options);
  photo_chart.draw(photo_data, options);

      }
