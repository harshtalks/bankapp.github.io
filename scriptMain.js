"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2021-07-17T18:49:59.371Z",
    "2021-07-18T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EURO",
  locale: "en-BG",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

//work

//DOMS
const accountToShow = document.querySelector(".credentials");
const movementContainer = document.querySelector(".movements");
const BalanceValue = document.querySelector(".balance__value");
const summaryIncomeValue = document.querySelector(".summary__value--income");
const summaryOutcomeValue = document.querySelector(".summary__value--out");
const summaryInterestValue = document.querySelector(
  ".summary__value--interest"
);
const btnLogin = document.querySelector(".login__btn");
const loginInputUser = document.querySelector(".login__input--user");
const loginInputPin = document.querySelector(".login__input--pin");
const welcome = document.querySelector(".welcome_text");
const welcomeHead = document.querySelector(".welcome--head");
const welcomeSubhead = document.querySelector(".welcome--subhead");
const hidePreLoginData = document.querySelector(".user--menu");
const app = document.querySelector(".app");
//Transfer
const btnTransferMoney = document.querySelector(".form__btn--transfer");
const transferAmount = document.querySelector(".form__input--amount");
const transferTo = document.querySelector(".form__input--to");
//Request Loan
const btnLoan = document.querySelector(".form__btn--loan");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
//closing account
const btnClose = document.querySelector(".form__btn--close");
const closeUserPin = document.querySelector(".form__input--pin");
const closeUserUsername = document.querySelector(".form__input--user");
//IMPORTANT
const disc = document.querySelector(".disclaimer");
let currentAcc;
let timer;
//generating username first

//INTERNATIONAL DATE AND TIME

const formattedDate = function (date, locale) {
  const dayPassed = (day1, day2) => {
    return Math.round(Math.abs(day1 - day2) / (60 * 60 * 24 * 1000));
  };

  const dayPassedAre = dayPassed(new Date(), date);
  if (dayPassedAre === 0) return "today";
  else if (dayPassedAre === 1) return "yesterday";
  else if (dayPassedAre <= 7) return `${dayPassedAre} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formattedCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const createUserName = function (acc) {
  acc.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

const accountList = function (acc) {
  accountToShow.innerHTML = "";

  acc.forEach((element) => {
    const htmlForAccountList = `<div class="accounts">
              <p>Username: ${element.username}<br>PIN: ${element.pin}</div>`;

    accountToShow.insertAdjacentHTML("afterbegin", htmlForAccountList);
  });
};

accountList(accounts);

const startLogOutTime = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);

    document.querySelector(".timer").textContent = `${min}:${second}`;

    if (time === 0) {
      clearInterval(timer);
      hidePreLoginData.classList.remove("hide--after--login");
      app.classList.add("before--login");
      welcomeHead.textContent = "Login to Continue";
      welcomeSubhead.textContent = "Use one of these accounts to continue";
      disc.classList.remove("hide--disclaimer");
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//Movement Functions

const getMovements = function (account, sort = false) {
  const movement = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movementContainer.innerHTML = "";
  movement.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const displayDate = formattedDate(date, account.locale);
    const movFormat = formattedCurrency(mov, account.locale, account.currency);
    const htmlMovement = `<div class="movements__row">
              <div class="movement__type movement__type-${type}">$${
      i + 1
    } ${type}</div>
    <div class="movement__date">${displayDate}</div>
              <div class="movement__value">${movFormat}</div>
            </div>`;

    movementContainer.insertAdjacentHTML("afterbegin", htmlMovement);
  });
};

//Displaying Balance
const getTotalBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  BalanceValue.textContent = formattedCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

//Summary Function

const getTotalSummary = function (account) {
  const income = account.movements
    .filter((m) => m > 0)
    .reduce((acc, m) => acc + m, 0);

  summaryIncomeValue.textContent = formattedCurrency(
    income,
    account.locale,
    account.currency
  );

  //outcome

  const outcome = account.movements
    .filter((m) => m < 0)
    .reduce((acc, m) => acc + Math.abs(m), 0);

  summaryOutcomeValue.textContent = formattedCurrency(
    outcome,
    account.locale,
    account.currency
  );

  const interest = account.movements
    .map((m) => (m * account.interestRate) / 100)
    .filter((m) => m >= 1)
    .reduce((acc, m) => acc + m, 0);

  summaryInterestValue.textContent = formattedCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const updateApp = function (acc) {
  getTotalSummary(acc);
  getTotalBalance(acc);
  getMovements(acc);
};

const welcomeText = function (acc) {
  welcomeHead.textContent = `Welcome, ${acc.owner.split(" ")[0]}`;
  welcomeSubhead.textContent =
    "you will be logged out, after 5 minutes of inactivity.";
};

//login action
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAcc = accounts.find((acc) => acc.username === loginInputUser.value);
  console.log(currentAcc);
  if (currentAcc?.pin === Number(loginInputPin.value)) {
    welcomeText(currentAcc);
    hidePreLoginData.classList.add("hide--after--login");
    app.classList.remove("before--login");
    disc.classList.add("hide--disclaimer");

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    document.querySelector(".balance__date").textContent =
      new Intl.DateTimeFormat(currentAcc.locale, options).format(now);
    updateApp(currentAcc);
  }

  if (timer) clearInterval(timer);
  timer = startLogOutTime();

  loginInputPin.value = loginInputUser.value = "";
  loginInputPin.blur();
});

//Transfer Money Section
btnTransferMoney.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);
  const recieve = accounts.find((acc) => acc.username === transferTo.value);

  transferTo.value = transferAmount.value = "";

  if (
    recieve &&
    amount > 0 &&
    currentAcc.balance > amount &&
    recieve?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    recieve.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    recieve.movementsDates.push(new Date().toISOString());
    updateApp(currentAcc);
    clearInterval(timer);
    timer = startLogOutTime();
  }
});

//REQUESTING LOAN
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some((acc) => acc >= amount * 0.1)) {
    setTimeout(() => {
      currentAcc.movements.push(amount);
      currentAcc.movementsDates.push(new Date().toISOString());
      updateApp(currentAcc);

      if (timer) clearInterval(timer);
      timer = startLogOutTime();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

//Cloasing Account:
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(closeUserUsername.value);

  if (
    closeUserUsername.value === currentAcc.username &&
    Number(closeUserPin.value) === currentAcc.pin
  ) {
    hidePreLoginData.classList.remove("hide--after--login");
    app.classList.add("before--login");
    welcomeHead.textContent = "Login to Continue";
    welcomeSubhead.textContent = "Use one of these accounts to continue";
    disc.classList.remove("hide--disclaimer");
  }
  closeUserUsername.value = closeUserPin.value = "";
});

let isSorted = false;
document.querySelector(".btn--sort").addEventListener("click", function (e) {
  e.preventDefault();
  getMovements(currentAcc, !isSorted);
  isSorted = !isSorted;
  if (timer) clearInterval(timer);
  timer = startLogOutTime();
});
