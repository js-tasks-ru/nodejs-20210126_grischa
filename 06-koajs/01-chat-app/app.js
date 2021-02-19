const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    subscribers.push(resolve);
    console.log(`Added new subscriber. Total subscribers count ${subscribers.length}`);

    ctx.req.on('aborted', () => {
      subscribers.splice(subscribers.indexOf(resolve), 1);
      console.log(`Subscriber removed. Total subscribers count ${subscribers.length}`);
    });
  });

  promise.then((message) => {
    ctx.body = message;
  });
  return await promise;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.throw(400, 'Bas Request');
  }

  subscribers.forEach((resolve) => {
    resolve(message);
  });
  subscribers = [];
  ctx.body = 'Ok';
});

app.use(router.routes());

module.exports = app;
