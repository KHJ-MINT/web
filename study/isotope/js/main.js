let grid = document.querySelector('.grid');

let iso = new Isotope(grid, {
  itemSelctor: '.element-item',
  layoutMode: 'fitRows',
});

//필터링 함수
let filterFns = {
  numberGreaterThan50: function(item){
    let num = item.querySelector('.number').textContent;
    console.log(num);
    return parseInt(num, 10) > 50;
  }
}