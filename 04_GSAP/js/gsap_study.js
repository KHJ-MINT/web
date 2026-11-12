document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)

  //트윈 : 애니메이션 동작을 수행하는 속성 설정기.
  //대상을 지정하고(target), 지속 시간(duration)을 주면, 애니메이션이 진행됨에 따라 설정한 속성 값을(위치, 크기, 색상 등등) 부드럽게 변화시킴.

  //gsap.to() : 현재 상태에서 지정한 목표 값으로 애니메이션이 실행됨.
  gsap.to('.box', {
    rotate: 27, //27도로 회전
    x: 100, //x축(오른쪽) 방향으로 100px 이동
    duration: 1, //1초 동안 실행
  });

  gsap.from('.box', {
    rotate: 30,
    x: 200,
    duration: 1,
    ease: "power1.out",
  });

  
}); //end