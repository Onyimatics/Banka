/* eslint-disable no-undef */

const transactionContainer = document.getElementById('transaction');
const loadTransactionDetails = (accountNumber) => {
  const url = `https://bankaapp.herokuapp.com/api/v2/accounts/${accountNumber}/transactions`;
  // const url = `http://localhost:3000/api/v2/accounts/${accountNumber}/transactions`;
  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      let htmlList = '';
      if (response.status === 200) {
        response.data.forEach((transaction) => {
          htmlList += `
          <table id="transaction-table" class="stats-table" >
        <td>${new Date(transaction.createdOn).getDate()}-${new Date(transaction.createdOn).getMonth() + 1}-${new Date(transaction.createdOn).getFullYear()}
        ${new Date(transaction.createdOn).getHours()}:${new Date(transaction.createdOn).getMinutes()}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.oldBalance}</td>
        <td>${transaction.newBalance}</td>
        </table>
        `;
        });
        transactionContainer.innerHTML = htmlList;
      }
      if (response.status === 404) {
        transactionContainer.innerText = 'No transaction found';
        transactionContainer.style.color = 'purple';
      }
    })
    .catch((error) => {
      errorDiv.style.display = 'block';
      const msg = createNode('li');
      msg.innerHTML = error.message || 'Error in connecting, Please check your internet connection and try again';
      append(errorContainer, msg);
      setTimeout(() => {
        errorDiv.style.display = 'none';
        errorContainer.innerHTML = '';
      }, 5000);
    });
};

loadTransactionDetails();
