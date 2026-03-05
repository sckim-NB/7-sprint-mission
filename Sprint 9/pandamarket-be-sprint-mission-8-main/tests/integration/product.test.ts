import request from 'supertest';
import { app } from '../../src/main'; // Express 앱을 export하고 있는 파일 경로

describe('상품 API 통합 테스트 (인증 x)', () => {
  it('GET /products 요청 시 상품 목록을 반환해야 한다', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
