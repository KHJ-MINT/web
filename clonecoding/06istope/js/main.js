window.addEventListener('load', () => {
  const grid = new Isotope('section', { //배치할 요소를 감싸고 있는 부모
    itemSelector: 'article', //배치할 요소명
    columnWidth: 'article', //너비값을 구할 요소명
    transitionDuration: '0.5s', //화면 재배치 시 요소가 움직이는 속도
  });

  //모든 버튼을 변수에 저장
  const btns = document.querySelectorAll('main ul li');
  for (let btn of btns) {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); //a의 기본 이벤트 제거

      //변수 sort에 클릭한 대상의 자식인 a 요소의 href 속성값 저장
      const sort = e.currentTarget.querySelector('a').getAttribute('href');
      // console.log(sort);

      grid.arrange({
        filter: sort,
      });

      //다시 모든 버튼의 개수만큼 반복
      for(let btn of btns) {
        btn.classList.remove('on');
      }

      //클릭한 대상만 선택해서 클래스명 on을 추가해서 활성화시킴.
      e.currentTarget.classList.add('on');
    });
  }
}); //end