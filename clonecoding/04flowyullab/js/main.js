//햄버거 메뉴 클릭 시 전체 메뉴 오픈
const header = document.querySelector('header');

document.getElementById('ham_menu').addEventListener('click', function() {
  header.classList.toggle('on');
});