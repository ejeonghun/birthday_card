export const shareKakao = (webUrl, thumbImg) => { // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
      }

  kakao.Link.sendDefault({
    objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
    content: {
      title: '생일 축하 카드 도착!', // 제목
      description: "친구 혹은 가족, 연인들의 메세지가 담겨있어요 열어보세요😍", // 내용
      imageUrl: thumbImg,
      link: {
        mobileWebUrl: webUrl, // URL주소
        webUrl: webUrl
      }
    },
    buttons: [
      {
        title: "보러가기",
        link: {
          mobileWebUrl: webUrl,
          webUrl: webUrl
        }
      }
    ]
  });
}
};