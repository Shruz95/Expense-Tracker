// Function to export data from table to CSV
function exportTableToCSV(filename) {
    // Array to hold the CSV data
    const csv = [];
    // Get all rows in the table
    const rows = document.querySelectorAll("table tr");
    // Loop through each row
    rows.forEach(function(row) {
        const rowData = [];
        // Get all cells (th and td) in the row
        const cells = row.querySelectorAll("th, td");
        cells.forEach(function(cell, index) {
            // Exclude cells in the last column (Delete column)
            if (index < cells.length - 1) {
                // Add cell content to rowData array
                rowData.push(cell.textContent);
            }
        });
        // Join rowData array into a string and push it to csv array
        csv.push(rowData.join(","));
    });
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    // Encode CSV content
    const encodedUri = encodeURI(csvContent);
    // Create a link element to trigger download
    const link = document.createElement("a");
    // Set link attributes
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    // Append link to body and trigger click event to download CSV file
    document.body.appendChild(link);
    link.click();
}

// Add event listener to the export button
document.getElementById("export-btn").addEventListener("click", function() {
    // Call exportTableToCSV function with filename as argument
    exportTableToCSV("expense_data");
});

// Code for expense tracking and pie chart
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

// Event listener for add button
addBtn.addEventListener('click', function() {
    // Get input values
    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    // Validation
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

    // Add expense to expenses array
    expenses.push({ category, amount, info, date });
    // Update totalIncome and totalExpense
    if (category === 'Income') {
        totalIncome += amount;
    } else if (category === 'Expense') {
        totalExpense += amount;
    }

    // Update expense list, total amount, and pie chart
    updateExpenseList(expenses.length - 1);
    updateTotalAmount();
    updatePieChart();
});

// Function to update expense list in the table
function updateExpenseList(index) {
    const expense = expenses[index];
    const newRow = expenseTableBody.insertRow();

    // Insert cells for category, amount, info, date, and delete button
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    // Event listener to delete expense
    deleteBtn.addEventListener('click', function() {
        // Remove expense from expenses array and table row
        expenses.splice(index, 1);
        expenseTableBody.removeChild(newRow);
        // Recalculate totalIncome and totalExpense
        if (expense.category === 'Income') {
            totalIncome -= expense.amount;
        } else if (
