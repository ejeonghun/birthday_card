# Birthday_card(생일축하 카드 서비스)
## [서비스 이용하기](https://main.lunaweb.dev/birthday_card/)

## 프로젝트 개요
지인이나 가족의 생일 축하 카드를 만들고, 링크를 카카오톡으로 공유하여 지인들끼리 댓글을 작성하여

축하를 해 주는데 중점을 둔 서비스

## Stack
- React
- Supabase
- Imgur API
- HashRouter
- Cloudflare Workers
- Github Pages
- KaKao API

## 프로젝트 설명
Supabase를 이용하여 클라이언트 단에서 DB에 접속을 하여, 등록/조회를 할 수 있도록 기능을 구현

사용자가 글을 작성할 때 이미지를 첨부하면 Cloudflare Workers에 접속하여 작성해놓은 Imgur API에

이미지 업로드 후 Image URL를 반환하여 Supabase에 같이 등록하여 줄 수 있도록 구현

사용자가 링크를 카카오톡으로 공유를 하고 해당 URL에 접속 시 URL 쿼리스트링으로 uuid를 분리하여 해당 uuid

의 게시글과 댓글 리스트를 조회하여 웹앱에 표시합니다.

## 기능
- 게시글 작성
- 게시글 조회

- 댓글 작성
- 댓글 조회
- 카카오톡 링크 공유
- 이미지 등록

## DEMO IMAGE
![main](https://github.com/ejeonghun/birthday_card/assets/41509711/d46d2a39-aeac-41ca-becc-3b8aa425ffde)
### [화면구성](https://github.com/ejeonghun/birthday_card/wiki/%ED%99%94%EB%A9%B4-%EA%B5%AC%EC%84%B1)
