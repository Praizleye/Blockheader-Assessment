document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const BUDGET_THRESHOLD = 1000;
    
    // DOM elements
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategoryInput = document.getElementById('expense-category');
    const categoryFilter = document.getElementById('category-filter');
    const expensesContainer = document.getElementById('expenses-container');
    const totalAmountElement = document.getElementById('total-amount');
    const amountErrorElement = document.getElementById('amount-error');
    const progressBar = document.getElementById('progress-bar');
    const budgetWarning = document.getElementById('budget-warning');
    const categorySummary = document.getElementById('category-summary');

    // Initialize expenses from localStorage or empty array
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    // Initialize the UI
    updateUI();
    
    // Add expense form submission handler
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = expenseNameInput.value.trim();
        const amountStr = expenseAmountInput.value;
        const category = expenseCategoryInput.value;
        
        // Input validation
        if (name === '') {
            showError(expenseNameInput, 'Please enter a description');
            return;
        }
        
        const amount = parseFloat(amountStr);
        
        // Validate amount
        if (isNaN(amount)) {
            showError(amountErrorElement, 'Please enter a valid number');
            return;
        }
        
        if (amount <= 0) {
            showError(amountErrorElement, 'Amount must be greater than zero');
            return;
        }
        
        // Clear any previous errors
        clearError(amountErrorElement);
        
        // Create new expense object
        const newExpense = {
            id: Date.now(), // Use timestamp as unique ID
            name,
            amount,
            category,
            date: new Date().toISOString()
        };
        
        // Add to expenses array
        expenses.push(newExpense);
        
        // Save to localStorage
        saveExpenses();
        
        // Update UI
        updateUI();
        
        // Reset form
        expenseForm.reset();
        
        // Show success message
        showNotification('Expense added successfully!', 'success');
    });
    
    // Category filter change handler
    categoryFilter.addEventListener('change', function() {
        updateExpensesList();
    });
    
    // Event delegation for delete buttons
    expensesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
            const button = e.target.classList.contains('delete-btn') ? e.target : e.target.parentElement;
            const id = parseInt(button.dataset.id);
            
            // Remove expense from array
            expenses = expenses.filter(expense => expense.id !== id);
            
            // Save to localStorage
            saveExpenses();
            
            // Update UI
            updateUI();
            
            // Show success message
            showNotification('Expense deleted!', 'success');
        }
    });
    
    // Function to save expenses to localStorage
    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    // Function to update all UI elements
    function updateUI() {
        updateExpensesList();
        updateTotalAmount();
        updateCategorySummary();
    }
    
    // Function to update expenses list based on selected filter
    function updateExpensesList() {
        const selectedCategory = categoryFilter.value;
        
        // Filter expenses based on selected category
        const filteredExpenses = selectedCategory === 'All' 
            ? expenses 
            : expenses.filter(expense => expense.category === selectedCategory);
        
        // Clear current list
        expensesContainer.innerHTML = '';
        
        // Check if there are any expenses to show
        if (filteredExpenses.length === 0) {
            expensesContainer.innerHTML = '<div class="no-expenses">No expenses found.</div>';
            return;
        }
        
        // Sort expenses by date (newest first)
        const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Add each expense to the list
        sortedExpenses.forEach(expense => {
            const expenseElement = document.createElement('div');
            expenseElement.classList.add('expense-item');
            
            const formattedAmount = formatCurrency(expense.amount);
            const formattedDate = formatDate(expense.date);
            
            expenseElement.innerHTML = `
                <div class="expense-details">
                    <span class="expense-name">${expense.name}</span>
                    <span class="expense-meta">
                        <span class="expense-category ${expense.category}">${expense.category}</span>
                        <span class="expense-date">${formattedDate}</span>
                    </span>
                </div>
                <span class="expense-amount">${formattedAmount}</span>
                <button class="delete-btn" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            expensesContainer.appendChild(expenseElement);
        });
    }
    
    // Function to update total amount and progress bar
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Update total text
        totalAmountElement.textContent = formatCurrency(total);
        
        // Update progress bar
        const percentage = Math.min((total / BUDGET_THRESHOLD) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        
        // Change color based on percentage
        if (percentage >= 100) {
            progressBar.style.backgroundColor = '#e74c3c';
            budgetWarning.classList.remove('hidden');
        } else if (percentage >= 80) {
            progressBar.style.backgroundColor = '#f39c12';
            budgetWarning.classList.add('hidden');
        } else {
            progressBar.style.backgroundColor = '#ffffff';
            budgetWarning.classList.add('hidden');
        }
    }
    
    // Function to update category summary
    function updateCategorySummary() {
        // Clear current summary
        categorySummary.innerHTML = '';
        
        if (expenses.length === 0) {
            categorySummary.innerHTML = '<div>No expenses to summarize.</div>';
            return;
        }
        
        // Group expenses by category
        const categoryTotals = {};
        let grandTotal = 0;
        
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            grandTotal += expense.amount;
        });
        
        // Create summary elements
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = (amount / grandTotal) * 100;
            
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('category-item');
            
            categoryElement.innerHTML = `
                <div class="category-info">
                    <div>
                        <span class="category-name">${category}</span>
                        <span class="category-percent">(${percentage.toFixed(1)}%)</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-progress ${category}" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <span class="category-amount">${formatCurrency(amount)}</span>
            `;
            
            categorySummary.appendChild(categoryElement);
        });
    }
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Helper function to show error
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }
    
    // Helper function to clear error
    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }
    
    // Helper function to show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add this to the end of the existing CSS
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        .success {
            background-color: var(--success-color);
        }
        
        .error {
            background-color: var(--danger-color);
        }
        
        .hide {
            animation: slideOut 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyle);
});