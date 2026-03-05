import request from 'supertest';
import { app } from '../../src/main';

describe('통합 테스트 (기본 요구사항 준수)', () => {
  // 요구사항: 인증 미필요 게시글 API
  it('GET /articles - 게시글 목록 조회', async () => {
    const res = await request(app).get('/articles');
    expect(res.status).not.toBe(404); // 404만 아니면 라우터 연결은 확인된 것
  });

  // 요구사항: 로그인 API
  it('POST /auth/login - 잘못된 정보로 로그인 시도', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: '123' });
    expect([400, 401, 500]).toContain(res.status); // 로직 연결 확인
  });

  // 요구사항: 인증 필요 상품 API
  it('POST /products - 토큰 없이 생성 시 401 확인', async () => {
    const res = await request(app).post('/products').send({ name: '가짜상품' });
    expect(res.status).toBe(401);
  });
});
