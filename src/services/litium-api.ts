import { type LitiumConfig } from '../types/config';
import { BlocksService } from './blocks/blocks-service';
import { ProductsService } from './products/products-service';
import { CustomersService } from './customers/customers-service';
import { MediaService } from './media/media-service';
import { WebsitesService } from './websites/websites-service';
import { OrdersService } from './orders/orders-service';
import { GlobalizationService } from './globalization/globalization-service';
import { ApiDiscoveryService } from './api-discovery/api-discovery-service';
import { ApiDocumentationService } from './api-documentation/api-documentation-service';

export class LitiumApiService {
  public readonly blocks: BlocksService;
  public readonly products: ProductsService;
  public readonly customers: CustomersService;
  public readonly media: MediaService;
  public readonly websites: WebsitesService;
  public readonly orders: OrdersService;
  public readonly globalization: GlobalizationService;
  public readonly discovery: ApiDiscoveryService;
  public readonly documentation: ApiDocumentationService;

  constructor(config: LitiumConfig) {
    this.blocks = new BlocksService(config);
    this.products = new ProductsService(config);
    this.customers = new CustomersService(config);
    this.media = new MediaService(config);
    this.websites = new WebsitesService(config);
    this.orders = new OrdersService(config);
    this.globalization = new GlobalizationService(config);
    this.discovery = new ApiDiscoveryService(config);
    this.documentation = new ApiDocumentationService(config);
  }
}