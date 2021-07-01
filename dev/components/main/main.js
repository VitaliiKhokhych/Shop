let buttons = document.querySelectorAll('.courses--tabs .courses--tab');
let object = document.querySelectorAll('.courses .courses--items');

for (let i = 0; i < buttons.length; i++){

  buttons[i].onclick = function(){
    object.forEach(n =>{
      n.classList.remove('active')
      object[i].classList.add('active');
    })
  };

}
