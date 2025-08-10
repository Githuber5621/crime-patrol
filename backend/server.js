import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { ruruHTML } from 'ruru/server';
import { createHandler } from 'graphql-http/lib/use/express';
import express from 'express';
 
// Construct a schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: { 
        type: GraphQLString,
        resolve: () => 'Hello world!'
      },
    },
  }),
});
 
const app = express();
 
// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
  }),
);

// Serve the GraphiQL IDE.
app.get('/graphql/ide', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// Start the server at port
app.listen(4000);
console.log('Running a REST API server at http://localhost:4000/api/');
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
 