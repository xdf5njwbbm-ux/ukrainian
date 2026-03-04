document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('progressChart').getContext('2d');

    // Gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    const chartData = {
        day: {
            labels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'],
            data: [5, 12, 18, 25, 30, 42, 50],
            stats: { words: '12', time: '45m', errors: '94%', lessons: '2' }
        },
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [100, 150, 130, 210, 250, 320, 400],
            stats: { words: '124', time: '4.5h', errors: '92%', lessons: '18' }
        },
        week2: {
            labels: ['W1', 'W2'],
            data: [400, 850],
            stats: { words: '248', time: '9h', errors: '90%', lessons: '35' }
        },
        week3: {
            labels: ['W1', 'W2', 'W3'],
            data: [400, 850, 1320],
            stats: { words: '380', time: '14h', errors: '91%', lessons: '52' }
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [400, 850, 1320, 1950],
            stats: { words: '520', time: '22h', errors: '93%', lessons: '84' }
        },
        month2: {
            labels: ['Month 1', 'Month 2'],
            data: [1950, 4200],
            stats: { words: '1,100', time: '48h', errors: '95%', lessons: '160' }
        }
    };

    let progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.week.labels,
            datasets: [{
                label: 'Learning Growth',
                data: chartData.week.data,
                borderColor: '#ffd700',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffd700',
                pointBorderColor: 'rgba(255, 255, 255, 0.5)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: { size: 10 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: { size: 10 }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Handle filter clicks
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function () {
            const range = this.getAttribute('data-range');

            // UI Update
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Chart Update
            progressChart.data.labels = chartData[range].labels;
            progressChart.data.datasets[0].data = chartData[range].data;
            progressChart.update();

            // Stats Update
            const stats = chartData[range].stats;
            document.getElementById('stat-words').textContent = stats.words;
            document.getElementById('stat-time').textContent = stats.time;
            document.getElementById('stat-errors').textContent = stats.errors;
            document.getElementById('stat-lessons').textContent = stats.lessons;
        });
    });
});
