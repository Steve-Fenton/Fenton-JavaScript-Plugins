var Fenton = Fenton || {};

Fenton.charts = (function () {

    var hasClass = function (element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };

    var getChartSources = function (chartType) {
        var i;
        var chartSources = [];
        var tables = document.getElementsByTagName('table');
        for (i = 0; i < tables.length; i++) {
            if (hasClass(tables[i], chartType)) {
                chartSources.push(tables[i]);
            }
        }
        return chartSources;
    };

    var getSourceData = function (table) {
        var captionText, i, j;
        var labels = [];
        var cellValues = [];

        var captionElement = table.getElementsByTagName('caption');
        if (captionElement[0]) {
            captionText = captionElement[0].innerHTML;
        }

        var headers = table.getElementsByTagName('th');
        for (i = 0; i < headers.length; i++) {
            labels.push(headers[i].innerHTML);
        }

        var tableBody = table.getElementsByTagName('tbody')[0];
        var rows = tableBody.getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            var cells = rows[i].getElementsByTagName('td');
            cellValues[i] = [];
            for (j = 0; j < cells.length; j++) {
                cellValues[i][j] = cells[j].innerHTML;
            }
        }

        return  {
            caption: captionText,
            labels: labels,
            values: cellValues
        };
    };

    var getHighestValue = function (data) {
        var i, j;
        var info = {
            max: 0,
            bars: 0
        };
        for (i = 0; i < data.values.length; i++) {
            for (j = 1; j < data.values[i].length; j++) { // j = 1 because j = 0 is the row label
                info.bars++;
                if (data.values[i][j] > info.max) {
                    info.max = parseFloat(data.values[i][j]);
                }
            }
        }
        return info;
    };

    var getColumnChart = function (data, width, height) {
        var i, j;
        var columnCount = data.values.length;
        var info = getHighestValue(data);

        var unitHeight = height / info.max;
        var unitWidth = Math.floor((width - ((columnCount - 1) * 4)) / info.bars);

        var chart = '<h3 style="width: ' + width + 'px; text-align: center; margin-bottom: 0;">' + data.caption + '</h3>' +
            '<div class="chart-container" style="position: absolute; width: ' + width + 'px; height: ' + height + 'px;">';
        var legend = '<div style="margin-top: ' + height + 'px; width: ' + width + 'px; text-align: center; clear: both;">';

        for (i = 0; i < data.values.length; i++) {
            var label = data.values[i][0];
            for (j = 1; j < data.values[i].length; j++) { // j = 1 because j = 0 is the row label
                var series = data.labels[j];
                var val = parseFloat(data.values[i][j]);
                var bar = Math.floor(unitHeight * val);
                var pad = height - bar;
                chart += '<div class="chart-column" style="float: left; width: ' + unitWidth + 'px; height: ' + height + ';" title="' + label + ' - ' + series + ': ' + val + '">' +
                    '<div style="height: ' + bar + 'px; margin-top: ' + pad + 'px;" class="column-' + j + '">' +
                    '<span>' + label + ' - ' + series + ': ' + val + '</span>' +
                    '</div>' +
                    '</div>';

                if (j === 1) {
                    legend += '<div class="chart-legend" style="float: left; width: ' + (unitWidth * (data.values[i].length - 1)) + 'px;" title="' + label + ' - ' + series + '">' +
                        '<span>' + label + '</span>' +
                        '</div>';
                }
            }
            if (i < data.values.length - 1) {
                chart += '<div class="chart-column" style="float: left; width: 4px; height: ' + height + 'px;"></div>';
                legend += '<div class="chart-column" style="float: left; width: 4px; height: 1px;"></div>';
            }
        }

        chart += '</div>';
        legend += '</div>';
        return chart + legend;
    };

    return {
        draw: function () {
            var i;
            var tables = getChartSources('column-chart');
            for (i = 0; i < tables.length; i++) {
                var width = parseInt(tables[i].getAttribute('data-chart-width'));
                var height = parseInt(tables[i].getAttribute('data-chart-height'));
                var sourceData = getSourceData(tables[i]);
                var chart = getColumnChart(sourceData, width, height);
                var container = document.createElement('div');
                container.style.clear = 'both';
                container.innerHTML = chart;
                tables[i].parentNode.appendChild(container);
                tables[i].parentNode.style.height = (height + (container.offsetHeight * 2)) + 'px';
                tables[i].style.display = 'none';
            }
        }
    }
}());