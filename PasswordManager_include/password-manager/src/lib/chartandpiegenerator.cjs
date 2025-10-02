const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Bar chart: Vault size (MB)...
async function generateBarChart(vaults) {
  const chartCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });
  const config = {
    type: 'bar',
    data: {
      labels: vaults.map(v => v._id),
      datasets: [{
        label: 'Vault Size (MB)',
        data: vaults.map(v => parseFloat((v.sizeMB).toFixed(2))),
        backgroundColor: '#4285F4'
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'MB' } },
        x: { title: { display: true, text: 'Vaults' } }
      }
    }
  };
  return await chartCanvas.renderToBuffer(config);
}

async function generatePieChart(privateCount, sharedCount) {
  const chartCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });
  const config = {
    type: 'pie',
    data: {
      labels: ['Private', 'Shared'],
      datasets: [{
        data: [privateCount, sharedCount],
        backgroundColor: ['#34A853', '#FBBC05']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  };
  return await chartCanvas.renderToBuffer(config);
}

module.exports = { generateBarChart, generatePieChart };
