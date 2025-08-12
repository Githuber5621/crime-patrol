import cors from 'cors';
import express from 'express';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
import userRoutes from "./api/rest/routes/user.routes.js";

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

// ✅ Add CORS for your Vite dev server
app.use(cors({
  origin: "http://localhost:3000", // Your Vite dev server
  credentials: true
}));

// ✅ Parse JSON bodies
app.use(express.json());

// REST routes
app.use("/api/user", userRoutes);

// GraphQL API
app.all(
  '/graphql',
  createHandler({
    schema: schema,
  }),
);

// GraphiQL IDE
app.get('/graphql/ide', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// Start server
app.listen(4000, () => {
  console.log('Running a REST API server at http://localhost:4000/api/');
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
