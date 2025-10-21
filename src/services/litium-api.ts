import { type LitiumConfig } from '../types/config.js';
import { BlocksService } from './blocks/blocks-service.js';
import { ProductsService } from './products/products-service.js';
import { CustomersService } from './customers/customers-service.js';
import { MediaService } from './media/media-service.js';
import { WebsitesService } from './websites/websites-service.js';
import { OrdersService } from './orders/orders-service.js';

export class LitiumApiService {
  public readonly blocks: BlocksService;
  public readonly products: ProductsService;
  public readonly customers: CustomersService;
  public readonly media: MediaService;
  public readonly websites: WebsitesService;
  public readonly orders: OrdersService;

  constructor(config: LitiumConfig) {
    this.blocks = new BlocksService(config);
    this.products = new ProductsService(config);
    this.customers = new CustomersService(config);
    this.media = new MediaService(config);
    this.websites = new WebsitesService(config);
    this.orders = new OrdersService(config);
  }
}