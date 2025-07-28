const form = document.getElementById('form');
const transactionsList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const chartEl = document.getElementById('chart');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const ctx = chartEl.getContext('2d');
let chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#2ecc71', '#e74c3c'],
            borderWidth: 1
        }]
    },    
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = document.getElementById('text').value;
    const amount = +document.getElementById('amount').value;
    
    if (text.trim() === '' || amount === 0) return;
    
    const transaction = {
        id: generateID(),
        text,
        amount
    };
    
    transactions.push(transaction);
    updateLocalStorage();
    updateDOM();
    updateChart();
    
    form.reset();
});

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function updateDOM() {
    transactionsList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        
        item.innerHTML = `
            ${transaction.text} 
            <span>${sign}₹${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        
        transactionsList.appendChild(item);
    });    
    
    updateBalance();
}
function updateBalance() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    
    balanceEl.textContent = `₹${total}`;
    incomeEl.textContent = `+₹${income}`;
    expenseEl.textContent = `-₹${Math.abs(expense)}`;   
}

function updateChart() {
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
    chart.data.datasets[0].data = [income, expense];
    chart.update();
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateDOM();
    updateChart();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

updateDOM();
updateChart();