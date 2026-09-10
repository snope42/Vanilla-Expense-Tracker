let expenses = [];

let new_expense_tab = document.getElementById('new-expense');
let expenses_tab = document.getElementById('expenses-tab');
let name = document.getElementById('name');
let category = document.getElementById('category');
let amount = document.getElementById('amount');

let add_button = document.getElementById('add');
add_button.addEventListener('click', add);
let register_button = document.getElementById('register');
register_button.addEventListener('click', register);

document.addEventListener('click', event => {
    let isOutside =
        !new_expense_tab.contains(event.target) &&
        !add_button.contains(event.target);
    let isHidden = getComputedStyle(new_expense_tab).display === 'none';

    if (isOutside && !isHidden) toggleExpenseTab(false);
});

function add() {
    toggleExpenseTab(true);
}
function register() {
    let valid =
        name.value !== '' &&
        category.value !== 'Category' &&
        amount.value !== '';

    if (!valid) {
        console.log('Every field must be filled')
        return;
    }

    let expense = {
        name: name.value,
        category: category.value,
        amount: amount.value
    }
    expenses.push(expense);

    createRow(expense);

    toggleExpenseTab(false);
}

function createRow(expense) {
    let expenses_tab_body = document.getElementById('expenses-tab-body');
    expenses_tab_body.innerHTML +=
        "        <tr>" +
        `            <td>${expense.name}</td>` +
        `            <td>${expense.category}</td>` +
        `            <td>${expense.amount}</td>` +
        "        </tr>";


}

function toggleExpenseTab(show) {
    new_expense_tab.style.display = show ? 'flex' : 'none';
}