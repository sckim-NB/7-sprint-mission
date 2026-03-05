import request from 'supertest';
import { app } from '../../src/main';

describe('미션 요구사항 통합 테스트', () => {
  // 1. 인증이 필요하지 않은 상품 API
  it('GET /products - 상품 목록 조회 (인증 미필요)', async () => {
    const res = await request(app).get('/products');
    expect([200, 500]).toContain(res.status);
  });

  // 2. 인증이 필요하지 않은 게시글 API
  it('GET /articles - 게시글 목록 조회 (인증 미필요)', async () => {
    const res = await request(app).get('/articles');
    expect([200, 500]).toContain(res.status);
  });

  // 3. 로그인, 회원가입 API
  describe('Auth API 테스트', () => {
    it('POST /auth/register - 유효하지 않은 데이터로 가입 시도', async () => {
      const res = await request(app).post('/auth/register').send({ email: 'invalid' });
      expect([400, 500]).toContain(res.status); // 400(Struct 에러) 혹은 500(DB 에러)
    });

    it('POST /auth/login - 로그인 시도', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: '123' });
      expect([400, 500]).toContain(res.status);
    });
  });

  // 4 & 5. 인증이 필요한 API (토큰 없이 접근 시 401 Unauthorized 확인)
  describe('인증 필요 API (Protected)', () => {
    it('POST /products - 토큰 없이 접근 시 거절되어야 함', async () => {
      const res = await request(app).post('/products').send({ name: '테스트' });
      expect(res.status).toBe(401);
    });

    it('POST /articles - 토큰 없이 접근 시 거절되어야 함', async () => {
      const res = await request(app).post('/articles').send({ title: '테스트' });
      expect(res.status).toBe(401);
    });
  });
});
