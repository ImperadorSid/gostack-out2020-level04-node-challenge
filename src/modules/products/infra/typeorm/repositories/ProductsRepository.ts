import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const newProduct = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(newProduct);

    return newProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const foundProduct = await this.ormRepository.findOne({ name });

    return foundProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const foundProductsPromises = products.map(async ({ id }) => {
      const foundProduct = await this.ormRepository.findOne(id);

      if (!foundProduct) throw new AppError('Invalid product ID');

      return foundProduct;
    });

    const foundProducts = await Promise.all(foundProductsPromises);

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const foundProductsPromises = products.map(async ({ id, quantity }) => {
      const foundProduct = await this.ormRepository.findOne(id);

      if (!foundProduct) throw new AppError('Invalid product ID');

      if (foundProduct.quantity < quantity) {
        throw new AppError('This product is not available in this quantity');
      }

      foundProduct.quantity -= quantity;

      await this.ormRepository.save(foundProduct);

      return foundProduct;
    });

    const foundProducts = await Promise.all(foundProductsPromises);

    return foundProducts;
  }
}

export default ProductsRepository;
