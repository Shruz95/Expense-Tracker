
// Function to export data from table to CSV
function exportTableToCSV(filename) {
    const csv = [];
    const rows = document.querySelectorAll("table tr");
    rows.forEach(function(row) {
        const rowData = [];
        const cells = row.querySelectorAll("th, td");
        cells.forEach(function(cell, index) {
            // Exclude cells in the last column (Delete column)
            if (index < cells.length - 1) {
                rowData.push(cell.textContent);
            }
        });
        csv.push(rowData.join(","));
    });
    // Download CSV file
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    document.body.appendChild(link);
    link.click();
}

// Add event listener to the export button
document.getElementById("export-btn").addEventListener("click", function() {
    exportTableToCSV("expense_data");
});

// code for expense tracking and pie chart
let expenses = [];
let totalIncome = 0;
let totalExpense = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const canvas = document.getElementById('pie-chart');

// Initialize pie chart
const pieChart = new Chart(canvas, {
    type: 'pie',
    data: {
        labels: ['Expense', 'Income'],
        datasets: [{
            data: [totalExpense, totalIncome],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)', // Red for expense
                '#50C878', // Blue for income
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true
    }
});

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (info === '') {
        alert('Please enter a valid info');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    expenses.push({ category, amount, info, date });
    if (category === 'Income') {
        totalIncome += amount;
    } else if (category === 'Expense') {
        totalExpense += amount;
    }

    updateExpenseList(expenses.length - 1);
    updateTotalAmount();
    updatePieChart();
});

function updateExpenseList(index) {
    const expense = expenses[index];
    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenses.splice(index, 1);
        expenseTableBody.removeChild(newRow);
        // Recalculate total expense and income
        if (expense.category === 'Income') {
            totalIncome -= expense.amount;
        } else if (expense.category === 'Expense') {
            totalExpense -= expense.amount;
        }
        updateTotalAmount();
        updatePieChart();
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
}

function updateTotalAmount() {
    totalAmountCell.textContent = totalIncome - totalExpense;
}

function updatePieChart() {
    pieChart.data.datasets[0].data = [totalExpense, totalIncome];
    pieChart.update();
}