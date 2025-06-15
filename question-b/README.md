# Question B

## Expense Tracker

Simple web app to manage expenses with categorization, filtering, and summary.

### Features
- Add expense with description, positive amount, and category (Food, Transport, Utilities, Other)
- Filter list by category or show all
- Delete individual expenses
- Display total spending
- Warning if total exceeds threshold (default $1000)
- Input validation: blocks empty description, non-positive or non-numeric amounts, and missing category

### Running the App
1. Navigate to the `question-b/` folder
2. Open `index.html` in your browser

### Testing and Examples
1. Add expenses:
   - Valid: Description="Coffee", Amount=4.50, Category="Food"
   - Valid: Description="Bus Ticket", Amount=2, Category="Transport"
   - Invalid: Amount=-5 or Amount="abc" (blocked)
   - Invalid: Empty description or no category (blocked)
2. Verify list updates and delete button removes items
3. Use "Filter by Category" to view specific groups
4. Observe total spending update; add enough to exceed $1000 to see warning message

Explore edge cases by attempting invalid inputs and confirming proper alerts.
