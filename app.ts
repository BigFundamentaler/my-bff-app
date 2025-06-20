import { addAliases } from 'module-alias';
addAliases({
  '@root': __dirname,
  '@interfaces': `${__dirname}/interface`,
  '@config': `${__dirname}/config`,
  '@middlewares': `${__dirname}/middlewares`,
});

import Koa from 'koa';
import { createContainer, Lifetime } from 'awilix';
import views from 'koa-views'; // 替换 koa-swig
import config from '@config/index';
import serve from 'koa-static';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

const app = new Koa();
const { port, viewDir, staticDir } = config;

// 静态资源
app.use(serve(staticDir));

const container = createContainer();

// 依赖注入
container.loadModules([`${__dirname}/services/*.ts`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});

app.use(scopePerRequest(container));

// 替换模板引擎配置
app.use(views(viewDir, {
  extension: 'html',
  map: { html: 'ejs' } // 使用ejs渲染html文件
}));

app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));
app.use(loadControllers(`${__dirname}/routers/*.ts`));

app.listen(port, () => {
  console.log('BFF启动成功');
  console.log('network:', `127.0.0.1:${port}`);
});