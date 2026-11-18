document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)

  //트윈 : 애니메이션 동작을 수행하는 속성 설정기.
  //대상을 지정하고(target), 지속 시간(duration)을 주면, 애니메이션이 진행됨에 따라 설정한 속성 값을(위치, 크기, 색상 등등) 부드럽게 변화시킴.

  //gsap.to() : 현재 상태에서 지정한 목표 값으로 애니메이션이 실행됨.
  gsap.to('.box_list_1 .box', {
    duration: 1.5,
    x: 200,
    rotation: 360,
    backgroundColor: "#2ed573",
    ease: "elastic.inOut(1,0.3)",
  });

  gsap.to('.box_list_2 .box', {
    duration: 1,
    y: 100,
    stagger: 0.2, //0.2초씩 시차를 두고 동작
    ease: "power3.inOut",
  });

  //timeline으로 순서대로 연출하기
  let tl1 = gsap.timeline({
    repeat: -1, //무한 반복 설정.
    yoyo: true, //왕복 설정.
  });

  tl1.to(".box_list_3 .box1", {
    duration: 1, x: 150,
  });
  tl1.to('.box_list_3 .box2', {
    duration: 1, y: 150,
  });
  tl1.to('.box_list_3 .box3', {
    duration: 1, rotation: 180,
  })

}); //end