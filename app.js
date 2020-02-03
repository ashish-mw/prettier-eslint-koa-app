const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger')
const swaggerJSDoc = require('swagger-jsdoc');

const app = new Koa();
const router = new Router();

const serve = require('koa-static');
app.use(serve('api-docs'));

app.use(logger())

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Koa/Node Swagger API',
    version: '1.0.0',
    description: 'A RESTful Cat API with Swagger + Koa/Node',
  },
  host: 'localhost:5000',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    },
  },
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  // apis: ['./routes/*.js'],
  apis: ['app.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);


// dummy db
let db = require('./data');

app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb',
  }),
);

// middleware to printout the request
app.use((ctx, next) => {
  console.log('headers = ', ctx.request.headers)
  console.log('body = ', ctx.request.body)
  console.log('params = ', ctx.request.params)
  next();
})

// start of routes

// serve swagger
router.get('/swagger.json', ctx => {
  ctx.body = swaggerSpec;
});

/**
 * @swagger
 * definitions:
 *   Cat:
 *     properties:
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /secured-cats:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Cats
 *     description: Returns all cats
 *     produces:
 *       - application/json
 *     responses:
 *       403:
 *         description: 'Not authorized'
 *       200:
 *         description: An array of cats
 *         schema:
 *           $ref: '#/definitions/Cat'
 */
router.get('/cats', ctx => {
  ctx.body = db;
});

/**
 * @swagger
 * /cats:
 *   get:
 *     tags:
 *       - Cats
 *     description: Returns all cats
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of cats
 *         schema:
 *           $ref: '#/definitions/Cat'
 */
router.get('/cats', ctx => {
  ctx.body = db;
});


/**
 * @swagger
 * /cats/{id}:
 *   get:
 *     tags:
 *       - Cats
 *     description: Returns a single cat
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Cat's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single cat
 *         schema:
 *           $ref: '#/definitions/Cat'
 */
router.get('/cats/:id', ctx => {
  ctx.body = db.find(c => c.id == ctx.params.id);
});

/**
 * @swagger
 * /cats/{id}:
 *   put:
 *     tags: 
 *        - Cats
 *     description: Updates a single cat
 *     produces: 
 *        - application/json
 *     parameters:
 *        - name: id
 *          description: Cat's id
 *          in: path
 *          required: true
 *          type: integer
 *        - name: name
 *          in: body
 *          description: Fields for the Cat resource
 *          required: true
 *          schema:
 *           $ref: '#/definitions/Cat'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/cats/:id', ctx => {
  const index = db.findIndex(c => c.id == ctx.params.id);
  db[index]['name'] = ctx.request.body.name;
  ctx.body = db[index];
});


/**
 * @swagger
 * /cats:
 *   post:
 *     tags:
 *       - Cats
 *     description: Creates a new cat
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cat
 *         description: Cat object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Cat'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/cats', ctx => {
  const new_id = db.length;
  const new_cat = {
    id: new_id,
    name: ctx.request.body.name,
  };
  db.push(new_cat);

  ctx.body = new_cat;
});


/**
 * @swagger
 * /cats/{id}:
 *   delete:
 *     tags:
 *       - Cats
 *     description: Deletes a single cat
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Cat's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/cats/:id', ctx => {
  db = db.filter(c => c.id != ctx.params.id);

  ctx.body = {};
});

// end of routes

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000);
