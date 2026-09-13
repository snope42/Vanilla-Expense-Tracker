const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
localStorage.setItem("expenses", JSON.stringify(expenses));

let new_expense_tab = document.getElementById('new-expense');
let expense_edit_tab = document.getElementById('edit-expense');
let expenses_tab = document.getElementById('expenses-tab');
let name = document.getElementById('nameNew');
let category = document.getElementById('categoryNew');
let amount = document.getElementById('amountNew');
let expenses_tab_body = document.getElementById('expenses-tab-body');
let editedName = document.getElementById('name');
let editedCategory = document.getElementById('category');
let editedAmount = document.getElementById('amount');

let add_button = document.getElementById('add');
add_button.addEventListener('click', () => toggleNewExpenseTab(true));
let register_button = document.getElementById('registerNew');
register_button.addEventListener('click', registerNew);
let edit_register_button = document.getElementById('register');
edit_register_button.addEventListener('click', register);
let filter = document.getElementById(`filter`);
filter.addEventListener('change', event => refresh(event.target.value));

document.addEventListener('click', event => {
    let isAddButton = add_button.contains(event.target);
    let isInsideCenter = expenses_tab.contains(event.target);
    if (isAddButton || isInsideCenter) return;

    let isOutsideNewExpenseTab = !new_expense_tab.contains(event.target);
    let isNewExpenseTabHidden = getComputedStyle(new_expense_tab).display === 'none';
    if (isOutsideNewExpenseTab && !isNewExpenseTabHidden) toggleNewExpenseTab(false);

    let isOutsideExpenseEditTab = !expense_edit_tab.contains(event.target);
    let isExpenseEditTabHidden = getComputedStyle(expense_edit_tab).display === 'none';
    if (isOutsideExpenseEditTab && !isExpenseEditTabHidden) toggleExpenseEditTab(false);
});

refresh('none');
updateTotal();

function registerNew() {
    if (!valid(name.value, category.value, amount.value)) {
        console.log('Every field must be filled');
        return;
    }

    let expense = {
        id: Date.now(),
        name: name.value,
        category: category.value,
        amount: amount.value
    }
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    if (filter.value === 'none' || expense.category === filter.value) {
        createExpense(expense);
    }
    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateTotal();
    toggleNewExpenseTab(false);
}

function register() {
    if (!valid(editedName.value, editedCategory.value, editedAmount.value)) {
        console.log('Every field must be filled');
        return;
    }

    let id = Number(expense_edit_tab.dataset.id);
    let newExpense = {
        id: id,
        name: editedName.value,
        category: editedCategory.value,
        amount: editedAmount.value
    }

    let i = 0;
    expenses.forEach(expense => {
        if (expense.id === id) {
            expenses[i] = newExpense;
            return;
        }
        i++;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    refresh(filter.value);
    updateTotal();
    toggleExpenseEditTab(false);
}

function valid(name, category, amount) {
    return name !== '' &&
        (category !== 'Category' && category !== '') &&
        amount !== '';
}

function refresh(filter) {
    expenses_tab_body.innerHTML = '';

    for (let expense of expenses) {
        if (filter !== 'none' && expense.category !== filter) continue;
        createExpense(expense);
    }
}
function createRow(expense) {
    expenses_tab_body.insertAdjacentHTML(
        'beforeend',
        `<tr>
            <td>${expense.name}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}
               <select class='expense-menu' id='menu-${expense.id}'>
                  <option value="" selected hidden>⋮</option>
                  <option value="Edit">Edit</option>
                  <option value="Delete">Delete</option>
               </select>
            </td>
         </tr>`
    );
}
function addExpenseEventListener(expense) {
    let expense_menu = document.getElementById(`menu-${expense.id}`);

    expense_menu.addEventListener('change', event => {
        let option = event.target.value;

        if (option === 'Edit') {
            toggleExpenseEditTab(true, expense);
        } else if (option === 'Delete') {
            deleteExpense(expense);
        }

        expense_menu.selectedIndex = 0;
    });
}
function createExpense(expense) {
    createRow(expense);
    addExpenseEventListener(expense);
}

function updateTotal() {
    let total = document.getElementById('total');

    let newTotal = 0;
    for (let expense of expenses) {
        newTotal += Number(expense.amount);
    }

    total.innerText = String(newTotal);
}

function deleteExpense(expense) {
    let i = 0;
    expenses.forEach(exp => {
        if (exp.id === expense.id) {
            expenses.splice(i, 1);
            return;
        }
        i++;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    refresh(filter.value);
    updateTotal();
}

function toggleNewExpenseTab(show) {
    new_expense_tab.style.display = show ? 'flex' : 'none';
}
function toggleExpenseEditTab(show, expense) {
    expense_edit_tab.style.display = show ? 'flex' : 'none';

    let { id, name, category, amount } = show ? expense : {};
    Object.assign(expense_edit_tab.dataset, { id, name, category, amount });

    editedName.value = show ? expense.name : '';
    editedCategory.value = show ? expense.category : '';
    editedAmount.value = show ? expense.amount : '';
}