class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // Submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;

    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML =
        "<p> Value can't be empty or negative </p>";

      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }

  // Submit expense method
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const expenseAmount = this.amountInput.value;

    if (expenseValue === "" || expenseAmount === "" || expenseAmount < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p> Values can't be empty or negative </p>`;

      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      let amount = parseInt(expenseAmount);
      this.expenseInput.value = "";
      this.amountInput.value = "";

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount,
      };

      this.itemID++;
      this.itemList.push(expense);

      this.addExpense(expense);
      this.showBalance();
    }
  }

  // Show balance method
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;

    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>
    `;

    this.expenseList.appendChild(div);
  }

  // Calculate total expenses method
  totalExpense() {
    let total = 0;

    if (this.itemList.length > 0) {
      total = this.itemList.reduce((accumulator, currentValue) => {
        accumulator += currentValue.amount;
        return accumulator;
      }, 0);
    }

    this.expenseAmount.textContent = total;
    return total;
  }

  // Edit expenses method
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    parent = element.parentElement.parentElement.parentElement;

    // Remove from DOM
    this.expenseList.removeChild(parent);

    // Get item from list
    let expense = this.itemList.filter((item) => item.id === id);

    // Set value on expenses form
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    // Delete from list and update balance
    let tempList = this.itemList.filter((item) => item.id !== id);
    this.itemList = tempList;
    this.showBalance();
  }

  // Delete expenses method
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    parent = element.parentElement.parentElement.parentElement;

    // Remove from DOM
    this.expenseList.removeChild(parent);

    // Delete from list and update balance
    let tempList = this.itemList.filter((item) => item.id !== id);
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // New instance of UI Class
  const ui = new UI();

  // Budget Form Submit
  budgetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    ui.submitBudgetForm();
  });

  // Expense Form Submit
  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    ui.submitExpenseForm();
  });

  // Expense List Click
  expenseList.addEventListener("click", (event) => {
    if (event.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
});
