'use strict';

/////////////////////////////////////////////////
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
  interestRate:1,
  pin: 8888,
}

const account6 = {
owner: 'Dakash Arora',
  movements: [430, 1000, 700, 50, 90],
  interestRate:1,
  pin: 6666,
}


const account7 = {
owner: 'Deepak Mishra',
  movements: [430, 1000, 700, 50, 90],
  interestRate:1,
  pin: 9999,
}


const account8 = {
owner: 'Shivam garg',
  movements: [430, 1000, 700, 50, 90],
  interestRate:1,
  pin: 5555,
}




const account9 = {
owner: 'Samiska Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate:1,
  pin: 7777,
}

const accounts = [account1, account2, account3, account4,account5, account6, account7, account8, account9];


const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// Creating username 

const userName = function(name){
  name.forEach(function(user){

user.userName = user.owner
.toLowerCase()
.split(" ")
.map(n => n [0])
.join("")


  }
  )
  
}

userName(accounts)
console.log(accounts)
let loginAccounts
btnLogin.addEventListener("click",function(e){
  e.preventDefault();

loginAccounts = accounts.find(acc =>acc.userName === inputLoginUsername.value)

console.log(loginAccounts)

if (!loginAccounts) {
  console.log("Incorrect username or PIN");
  return;
}

if(Number(inputLoginPin.value) === loginAccounts.pin){
  labelWelcome.textContent = `Welcome back ${loginAccounts.owner}`
  containerApp.style.opacity = 1;

const now = new Date();
labelDate.textContent = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`
updateUI(loginAccounts);
inputLoginUsername.value=""
inputLoginPin.value=""
} else {
  console.log("Incorrect username or PIN");
}
})

const showData = function(renderData){
 
containerMovements.innerHTML = '';
  // const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
renderData.forEach(function(mov, i){
const type = mov > 0 ? 'deposit' : 'withdrawal';

  const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}
          </div>
     
          <div class="movements__value">${mov}€</div>
        </div>
   
  
  `



  containerMovements.insertAdjacentHTML('afterbegin', html);
})
}

const displayBalance = function(acc){
 acc.money = acc.movements.reduce((acc,mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.money}`
}

const displayBalnceIN = function(movements){
  const income = movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${income}€`;
}

const displayBalnceOut = function(movemnets){
  const withdrawls = movemnets
  .filter(mov => mov <0)
  .reduce((sum,mov) => sum + mov , 0)
  labelSumOut.textContent=`${Math.abs(withdrawls)}`
 
}

const displayInterset = function(acc){
  const interest = acc.movements
  .filter(mov => mov >0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter(interest => interest >= 1)
  .reduce((sum, interest) => sum + interest, 0);

 labelSumInterest.textContent = `${interest}€`
}

const updateUI = function(acc) {
  showData(acc.movements);
  displayBalance(acc);
  displayBalnceIN(acc.movements);
  displayBalnceOut(acc.movements);
  displayInterset(acc);
}

btnTransfer.addEventListener("click",function(e){
  e.preventDefault();
  const money = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";

  if (!loginAccounts) return;

  const currentBalance = loginAccounts.movements.reduce((sum, movement) => sum + movement, 0);
  if (money > 0 && receiverAcc && receiverAcc !== loginAccounts && currentBalance >= money) {
    loginAccounts.movements.push(-money);
    receiverAcc.movements.push(money);

    updateUI(loginAccounts);
  }

})


btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  if (!loginAccounts) return;

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && loginAccounts.movements.some(mov => mov >= amount * 0.1)) {

    loginAccounts.movements.push(amount);

    updateUI(loginAccounts);
  }

  
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (!loginAccounts) return;

  if (
    inputCloseUsername.value === loginAccounts.userName &&
    Number(inputClosePin.value) === loginAccounts.pin
  ) {
  
    const index = accounts.findIndex(
      acc => acc.userName === loginAccounts.userName
    );


    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    loginAccounts = null;
  }


  inputCloseUsername.value = inputClosePin.value = "";
});