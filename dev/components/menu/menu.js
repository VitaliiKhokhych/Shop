
let width = document.documentElement.clientWidth;
let = adap = document.getElementById('adptive');
let modal = document.getElementById('modal');

if (width < 450){
  adap.classList.add('block');
  adap.onclick = function () {
    modal.classList.toggle('active');
  };
}