import data from './data.js'
import barchart from './barchart.js'
import activityDisplay from './modal.js'

barchart.init('chart-anchor', 500, 300);
barchart.render(data, activityDisplay);