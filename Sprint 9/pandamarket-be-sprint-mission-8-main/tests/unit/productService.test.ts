import * as productsService from '../../src/services/productsService';
import * as productsRepository from '../../src/repositories/productsRepository';
import * as favoritesRepository from '../../src/repositories/favoritesRepository';
import * as notificationsService from '../../src/services/notificationsService';
import NotFoundError from '../../src/lib/errors/NotFoundError';

describe('ProductService 유닛 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // 각 테스트 후 Mock 초기화
  });

  describe('updateProduct', () => {
    const productId = 1;
    const userId = 10;
    const updateData = { userId, price: 20000 };
    const mockExistingProduct = { id: productId, userId, price: 10000, name: 'Old Product' };

    it('상품이 없으면 NotFoundError를 던져야 한다', async () => {
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue(null);

      await expect(productsService.updateProduct(productId, updateData)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('가격이 변경되면 알림 생성 서비스(notificationsService)가 호출되어야 한다', async () => {
      // 1. Repository Mocking
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue(mockExistingProduct as any);
      jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
        ...mockExistingProduct,
        price: 20000,
      } as any);
      jest
        .spyOn(favoritesRepository, 'getFavoritesByProductId')
        .mockResolvedValue([{ userId: 100, productId }] as any);

      // 2. NotificationService Spy 설정
      const notificationSpy = jest
        .spyOn(notificationsService, 'createNotifications')
        .mockResolvedValue([] as any);

      // 3. 실행
      await productsService.updateProduct(productId, updateData);

      // 4. 검증: 가격이 1만 -> 2만으로 변했으므로 알림 함수가 호출되었는가?
      expect(notificationSpy).toHaveBeenCalled();
    });
  });
});
