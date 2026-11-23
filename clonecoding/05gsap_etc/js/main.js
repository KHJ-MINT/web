document.addEventListener("DOMContentLoaded", (event) => {
  //gsap 스크롤 트리거 플러그인 추가
  gsap.registerPlugin(ScrollTrigger);

  //Lenis는 마우스 휠 스크롤을 부드럽게 만들어 줌.
  //GSAP ScrollTrigger와 함께 쓰면 스크롤 애니메이션이 더 자연스럽게 붙음.
  const lenis = new Lenis({
    //자동 실행 대신 직접 프레임을 돌리게 함.
    autoRaf: false,

    //스크롤이 살짝 따라오는 시간을 정함.
    duration: 0.8,

    //들어온 값을 그대로 써서 일정한 속도감을 만듦.
    easing: (t) => t,

    //마우스 휠 스크롤을 부드럽게 만듦.
    smoothWheel: true,

    //터치 스크롤도 lenis 흐름과 맞춤.
    syncTouch: true,
  });

  //매 프레임마다 lenis와 scrolltrigger를 같이 업데이트해야 스크롤 애니메이션이 어긋나지 않음.
  function raf(time) {
    //지금 프레임의 시간을 lenis에게 알려줌.
    lenis.raf(time);

    //scrolltrigger가 현재 스크롤 위치를 다시 계산하게 해줘야 함.
    ScrollTrigger.update();

    //다음 화면 프레임에서도 같은 일을 반복한다.
    requestAnimationFrame(raf);
  }

  //브라우저 애니메이션 프레임 루프를 시작함.
  requestAnimationFrame(raf);

  const siteHeader = document.getElementById('site_header');
  const menuToggle = document.getElementById('menu_toggle');
  const mobilePannel = document.getElementById('mobile_pannel');
  const navLinks = document.querySelectorAll('.mobile_nav a, .primary_nav a');

  //직전 스크롤 위치를 저장해서 방향을 비교함.
  let lastY = 0;
  lenis.on('scroll', ({ scroll }) => {
    //헤더가 없으면 더 진행하지 않음.
    if (!siteHeader) return;

    //lenis가 알려준 현재 스크롤 위치를 짧은 이름으로 담음.
    const y = scroll;

    //아래로 충분히 내렸고, 첫 화면을 지난 상태라면 헤더를 위로 숨김.
    if (y > lastY + 2 && y > 120) {
      siteHeader.style.transform = 'translateY(-100%)';
    } else if (y < lastY - 4) {
      //원래 자리로 되돌림.
      siteHeader.style.transform = 'translateY(0)';
    }

    //다음 비교를 위해 현재 위치를 저장
    lastY = y;

    //스크롤이 움직였으니 현재 섹션 메뉴 표시도 다시 맞춤.
    updateActiveFromViewport();
  });

  //모바일 메뉴 버튼을 누르면 메뉴 패널이 열리고 닫힘.
  if (menuToggle && mobilePannel) {
    menuToggle.addEventListener('click', () => {
      //is_open 클래스를 넣거나 빼고, 결과를 true나 false로 받음.
      const isOpen = mobilePannel.classList.toggle('is_open');

      //음성인식기를 위한 추가. 웹 접근성을 위한 조치임.
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  //메뉴 링크를 누른 뒤에는 모바일 메뉴를 닫아 화면을 다시 넓게 보여줌.
  function closeMobileMenu() {
    if (!menuToggle || !mobilePannel) return;

    mobilePannel.classList.remove('is_open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  const sectionMap = [
    '#hero',
    '#projects',
    '#info',
    '#showcase',
    '#gallery',
    '#stats',
    '#contact',
  ];

  function updateActiveFromViewport() {

  }

  gsap.timeline(
    {
      defualt: {
        duration: 0.8,
        ease: 'power2.out',
      },
    },
  )
    .to('.hero_title', {
      y: 0,
      opacity: 1,
    })
    .to('.hero_sub', {
      y: 0,
      opacity: 1,
    }, '<0.12')
    .to('.hero_cta', {
      y: 0,
      opacity: 1,
    }, '<0.12');

  document.querySelectorAll('.magnet_zone').forEach((zone) => {
    const btn = zone.querySelector('.cta_btn');

    //버튼이 없으면 자석 효과를 줄 대상도 없으니 멈춤.
    if (!btn) return;

    zone.addEventListener('mousemove', (e) => {
      //zone의 화면 위치와 크기를 가져오는 함수를 가져와 rect에 담음.
      const rect = zone.getBoundingClientRect();

      //마우스가 zone 중앙에서 가로로 얼마나 떨어졌는지 계산함.
      const x = e.clientX - (rect.left + rect.width / 2);
      //마우스가 zone 중앙에서 세로로 얼마나 떨어졌는지 계산함.
      const y = e.clientY - (rect.top + rect.height / 2);

      //계산한 거리의 10%만큼만 버튼을 움직여서 과하지 않게 애니메이션 추가.
      btn.style.transform = `translate(${x * 0.1}, ${y * 0.1});`;
    });

    zone.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0, 0);`;
    })
  });

}); //end