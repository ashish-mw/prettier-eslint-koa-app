const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// dummy db
let db = require('./data');

app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb',
  }),
);

// start of routes
router.get('/cats', ctx => {
  ctx.body = db;
});

router.get('/cats/:id', ctx => {
  ctx.body = db.find(c => c.id == ctx.params.id);
});

router.post('/cats', ctx => {
  const new_id = db.length;
  const new_cat = {
    id: new_id,
    name: ctx.request.body.name,
  };
  db.push(new_cat);

  ctx.body = new_cat;
});

router.put('/cats/:id', ctx => {
  const index = db.findIndex(c => c.id == ctx.params.id);
  db[index]['name'] = ctx.request.body.name;

  ctx.body = db[index];
});

router.delete('/cats/:id', ctx => {
  db = db.filter(c => c.id != ctx.params.id);

  ctx.body = {};
});

// end of routes

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000);
