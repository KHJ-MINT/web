//1.alert 예제
document.getElementById('btn_alert').onclick = () => {
  alert('이것은 alert()으로 알림 메시지 창입니다.');
}

//2.prompt 예제
//promt('입력 내용', '입력 내용 초기값');
document.getElementById('btn_prompt1').onclick = () => {
  const nickName = prompt('닉네임을 입력하세요.', '홍길동');
  // console.log(nickName);

  document.getElementById('ioResult').innerHTML = nickName;
}