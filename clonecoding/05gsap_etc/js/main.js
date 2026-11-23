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

  //화면의 42% 지점에 가장 가까운 섹션을 현재 섹션으로 판단함.
  //맨 아래 근처에는 contact 메뉴가 끝까지 active로 보이게 따로 처리함.
  function updateActiveFromViewport() {
    //문서 맨 아래의 가까운지 확인.
    const isNearBottom = window.screenY + window.innerHeight >= document.documentElement.scrollHeight - 80;

    //맨 아래라면 마지막 contact 메뉴를 켠다.
    if (isNearBottom) {
      setActiveByHref('#contact');
      return;
    }

    //화면 위에서 42% 내려온 지점을 현재 섹션 판단 기준으로 사용.
    const checkPoint = window.innerHeight * 0.42;

    //아직 못 찾았을 때 기본 active는 hero로 설정.
    let activeHref = '#hero';

    //가장 가까운 섹션을 찾기 위해서 큰 숫자로 시작함.
    let activeDistance = Infinity;

    //섹션 목록을 하나씩 돌면서 기준점과의 거리를 비교함.
    sectionMap.forEach((id) => {
      const section = document.querySelector(id);

      //섹션이 없으면 이번 항목을 건너뜀.
      if (!section) return;

      //화면 안에서 섹션의 현재 위치를 가져옴.
      const rect = section.getBoundingClientRect();

      //기준점이 섹션 안에 들어와 있는지 확인.
      const isInside = rect.top <= checkPoint && rect.bottom >= checkPoint;

      //섹션 안이면 거리 0, 바뀌면 위/아래 경계 중 더 가까운 거리로 계산
      const distance = isInside ? 0 : Math.min(Math.abs(rect.top - checkPoint), Math.abs(rect.bottom - checkPoint));

      //이번 섹션이 지금까지 본 섹션보다 기준점에 더 가까우면 교체
      if (distance < activeDistance) {
        //가장 가까운 거리 값을 갱신함.
        activeDistance = distance;

        //active로 켤 href도 이번 섹션 id로 변경함.
        activeHref = id;
      }

      setActiveByHref(activeHref);
    });
  }

  function setActiveByHref(herf) {
    //모든 메뉴 링크를 하나씩 확인.
    navLinks.forEach((link) => {
      //현재 링크에 href가 켜야 할 섹션 href와 같은지 비교함.
      const isSameLink = link.getAttribute('href') === herf;

      //같은 링크면 active를 켜고, 아니면 끈다.
      link.classList.toggle('is_active', isSameLink);
    });
  }

  setActiveByHref('#hero');

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
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    zone.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0, 0);`;
    });
  });

  //maquee는 같은 글자 줄을 여러 개 복사해서 끝없이 흐르는 것처럼 보이게 함.
  function maquee() {
    document.querySelectorAll('.marquee_wrap').forEach((wrap) => {
      const row = wrap.querySelector('.marquee_row');
      //기준 줄이 없으면 복사할 것이 없어서 건너뜀.
      if (!row) return;

      //한 줄에 실제 가로 길이를 저장함.
      const rowWidth = row.scrollWidth;

      for (let i = 1; i < 10; i += 1) {
        //기준 줄을 복사해서 wrap 안에 추가.
        wrap.appendChild(row.cloneNode(true));
      }

      const rows = wrap.querySelectorAll('.marquee_row');

      //현재 가로 이동 위치 저장.
      let x = 0;

      //한 프레임 마다 글자 줄을 조금씩 이동시키는 함수
      function step() {
        //reverse 클래스가 있으면 오른쪽으로, 없으면 왼쪽으로 움직임.
        const dir = wrap.classList.contains('reverse') ? -1 : 1;

        //방향에 맞춰 현재 위치를 1px씩 움직임.
        x += dir;

        //모든 복제 줄의 위치를 각각 다시 계산함.
        rows.forEach((item, index) => {
          //현재 줄은 기본 위치에 자기 순서만큼 rowWith를 더해 배치함.
          let offset = x + index * rowWidth;

          //왼쪽으로 나가서 완전히 사라진 줄은 맨 오른쪽 뒤로 보냄.
          if (dir === -1 && offset <= -rowWidth) {
            offset += rowWidth * rows.length;
          } else if (dir === 1 && offset >= rowWidth) {
            //오른쪽으로 나가서 완전히 사라진 줄은 맨 왼쪽 앞으로 보냄.
            offset -= rowWidth * rows.length;
          }

          //계산한 위치를 실제 화면 이동으로 적용
          item.style.transform = `translateX(${offset}px)`;
        });

        //다음 프레임에서도 계속 움직이게 예약.
        requestAnimationFrame(step);
      }
      //이 marquee 줄의 애니메이션을 시작함.
      requestAnimationFrame(step);
    });
  }

  //페이지에 있는 maquee들을 실제로 실행.
  maquee();

}); //end