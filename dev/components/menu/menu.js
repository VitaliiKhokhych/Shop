
let adap = document.querySelector('[data-adptive]');
let modal = document.querySelector('[data-modal]');

adap.onclick = function () {
  modal.classList.toggle('active');
};
