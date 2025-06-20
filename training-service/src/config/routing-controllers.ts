import { RoutingControllersOptions } from 'routing-controllers';

export const routingControllersOptions: RoutingControllersOptions = {
  classTransformer: true,
  validation: true,
  routePrefix: '/api',
  controllers: [__dirname + '/../controllers/*.ts'],
  middlewares: [__dirname + '/../middlewares/*.ts'],
  defaultErrorHandler: false,
};
