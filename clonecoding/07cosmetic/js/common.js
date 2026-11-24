document.addEventListener('DOMContentLoaded', () => {
  //햄버거 메뉴 클릭 시 header에 on 클래스 토글
  const $ham = document.querySelector('.ham');
  const $header = document.querySelector('header');

  $ham.addEventListener('click', () => {
    $header.classList.toggle('on');
    document.body.classList.toggle('lock');
  });

  //메뉴 li들에 순차적 딜레이 추가
  const gnbItems = document.querySelectorAll('header .fix .gnb>ul>li');

  gnbItems.forEach((li, idx) => {
    li.style.transitionDelay = `${0.2 * (idx + 1)}s`;
  });

}); //end