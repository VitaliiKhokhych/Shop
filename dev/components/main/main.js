let buttons = document.querySelectorAll('[data-courses-tab]');
let objects = document.querySelectorAll('[data-courses-items]');
let acc = 0;

for (let i = 0; i < buttons.length; i++){

  buttons[i].onclick = function(){
    
    buttons[acc].classList.remove('opacity')
    buttons[i].classList.add('opacity')
    objects[acc].classList.remove('active')

    objects.forEach( ()=>{
      objects[i].classList.add('active');
    })
    
    acc = i;
  };
  
}
