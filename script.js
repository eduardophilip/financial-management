const transactionUl = document.querySelector('.transactions-list');

const balanceDisplay = document.querySelector('.balance__current')
const incomeDisplay = document.querySelector('.money__plus');
const expenseDisplay = document.querySelector('.money__minus');

const formAddTransactions = document.querySelector('.add-transactions__form')
const nameAddedTransaction = document.querySelector('.add-transactions__name')
const amountAddedTransaction = document.querySelector('.add-transactions__amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = id => {
    transactions = transactions
        .filter(transaction => transaction.id !== id)
        updateLocalStorage()
        init()
}

const addTransactionIntoDom = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'transactions-list__minus' : 'transactions-list__plus';
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li');
    li.classList.add(CSSClass, 'list__added');
    li.innerHTML = `
    ${name} <span> ${operator} €${amountWithoutOperator}</span>
    <button class="transactions-list__delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionUl.append(li); 
};

const updateBalanceValues = () => {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount);

    const totalBalance = transactionsAmounts
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        .toFixed(2);

    const income = transactionsAmounts
        .filter(item => item >= 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2);

    const expense = Math.abs(transactionsAmounts
    .filter(item => item < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);

    balanceDisplay.textContent = `€${totalBalance}` 
    incomeDisplay.textContent = `€${income}`
    expenseDisplay.textContent = `€${expense}`

}

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDom);
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (nameTransaction, amountTransaction) => {
    transactions.push({
        id: generateID(),
        name: nameTransaction, 
        amount: Number(amountTransaction)
    });
};

const clearInput = () => {
    nameAddedTransaction.value = ''
    amountAddedTransaction.value = ''
}

const hendleFormSubmit = event => {
    event.preventDefault()

    const nameTransaction = nameAddedTransaction.value.trim();
    const amountTransaction = amountAddedTransaction.value.trim();

    if (nameTransaction === '' || amountTransaction === '') {
        alert('Por favor, preencha o nome quanto o valor da transação') 
        return
    }

    addToTransactionsArray(nameTransaction, amountTransaction)
    init();
    updateLocalStorage();
    clearInput()    
}

formAddTransactions.addEventListener('submit', hendleFormSubmit);

