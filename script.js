'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Satyam Mishra',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 8888,
};

const account6 = {
  owner: 'Dakash Arora',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 6666,
};

const account7 = {
  owner: 'Deepak Mishra',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 9999,
};

const account8 = {
  owner: 'Shivam garg',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 5555,
};

const account9 = {
  owner: 'Samiska Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 7777,
};

const accounts = [account1, account2, account3, account4, account5, account6, account7, account8, account9];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// 1. Creating username
const createUsername = function (user) {
  user.forEach(function (name) {
    name.userName = name.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
};
createUsername(accounts);

// 2. Display functions
const renderData = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>     
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalnce = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const sumIn = function (acc) {
  acc.incomes = acc.movements
    .filter(x => x > 0)
    .reduce((x, y) => x + y, 0);
  labelSumIn.textContent = `${acc.incomes}€`;
};

const sumOut = function (acc) {
  acc.withdrawal = acc.movements
    .filter(x => x < 0)
    .reduce((x, y) => x + y, 0);
  labelSumOut.textContent = `${Math.abs(acc.withdrawal)}€`;
};

const interest = function (acc) {
  acc.interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${acc.interest}€`;
};

// UI Updater Helper
const updateUI = function (acc) {
  renderData(acc.movements);
  calcDisplayBalnce(acc);
  sumIn(acc);
  sumOut(acc);
  interest(acc);
};

// 3. Login
let currentLogin;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentLogin = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentLogin?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${currentLogin.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    const now = new Date();
    labelDate.textContent = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentLogin);
  } else {
    console.log('error');
  }
});

// 4. Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentLogin.balance >= amount &&
    receiverAcc?.userName !== currentLogin.userName
  ) {
    currentLogin.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentLogin);
  }
});

// 5. Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentLogin.movements.some(mov => mov >= amount * 0.1)) {
    currentLogin.movements.push(amount);
    updateUI(currentLogin);
  }
  inputLoanAmount.value = '';
});

// 6. Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentLogin &&
    inputCloseUsername.value === currentLogin.userName &&
    Number(inputClosePin.value) === currentLogin.pin
  ) {
    const accountIndex = accounts.findIndex(
      acc => acc.userName === currentLogin.userName
    );

    if (accountIndex !== -1) accounts.splice(accountIndex, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    currentLogin = null;
  }
});