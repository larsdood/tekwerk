const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const cors = require('cors');
const bodyParser = require('body-parser');

const gQLbodyParser = require('body-parser-graphql');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = 'damn right';

const resolvers = {
  Query: {
    employers: async (_, args, context, info) => {
      return await context.prisma.query.employers({
        where: {
          name: args.name
        }
      },
      info)
    },
    postings: async (_, args, context, info) => {
      const { applicationCount, ...rest } = info;
      const result = await context.prisma.query.postings({
        where: {
          offeredBy: {  name: context.req.name }
        }
      }, info);
      console.log(result);
      return result;
    }
  },
  Mutation: {
    signupEmployer: async (_, args, context, info) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);
      return await context.prisma.mutation.createEmployer({
        data: {
          name: args.name,
          email: args.email,
          hashedPassword: hashedPassword,
        }
      })
    },
    loginEmployer: async (_, args, context, info) => {
      const employer = await context.prisma.query.employer({
        where: {
          name: args.name,
        }
      });
      const AuthorizationError = new Error('User or password incorrect');
      if (!employer) {
        context.res.status(403);
        return AuthorizationError;
      } 
      const match = await bcrypt.compare(args.password, employer.hashedPassword);
      if (match) {
        let { name, email } = employer;
        return jwt.sign({name, email, loginType: 'employer'}, jwtSecret);
      } else {
        context.res.status(403);
        return AuthorizationError;
      }
    },
    createPosting: async (_, args, context, info) => {
      const result = await context.prisma.mutation.createPosting({
        data: {
          offeredBy: { connect: { name: context.req.name} },
          postingTitle: args.postingTitle,
          positionTitle: args.positionTitle,
          employmentType: args.employmentType,
          description: args.description,
          requirements: args.requirements,
          customId: `${context.req.name}-${args.customId}`.toLowerCase(),
          createdDate: new Date().toISOString(),
          expiresAt: new Date(args.expiresAt).toISOString(),
          status: args.status || 'UPCOMING'
        }
      });
      return result;
    },
    releasePosting: async (_, args, context, info) => {
      // TODO: Sjekke at den som etterspør faktisk er den som eier posting
      console.log('i reached releasePosting. customId is: ', args.customId);
      const result = await context.prisma.mutation.updatePosting({
        where: {
          customId: args.customId,
          offeredBy: { connect: { name: context.req.name }}
        },
        data: {
          status: 'ACTIVE',
        }
      })
      console.log(result);
      return result.customId;
    }
  }
}

const privateResolvers = [
  resolvers.Mutation.createPosting.name,
  resolvers.Query.postings.name,
  resolvers.Mutation.releasePosting,
];

const expressAuthMiddleware = (req, res, next) => {
  const { query } = req.body;
  const resolver = query.substring(query.indexOf("{") + 1, query.indexOf('(')).trim();
  if (!privateResolvers.includes(resolver)) return next();
  const token = req.get('Authorization').split(' ')[1];
  if (!token) return res(403).send('Token missing');
  if (!jwt.verify(token, jwtSecret)) return res(403).send('Token invalid');

  const decoded = jwt.decode(token);
  req.name = decoded.name;
  next();
}

const server = new GraphQLServer({
  typeDefs: 'qlschema/schema.graphql',
  resolvers,
  context: ({request, response}) => ({
    req: request,
    res: response,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/larsdood-53fd52/tekwerk-db/dev',
    })
  })
})

server.express.use(cors());
server.express.use(bodyParser.urlencoded({ extended: false }))
server.express.use(gQLbodyParser.graphql())

server.express.post(server.options.endpoint, (req, res, next) => expressAuthMiddleware(req, res, next))

const PORT = 4000;
server.start({port: PORT}, () => console.log('GraphQL yoga server running on ' + PORT))
