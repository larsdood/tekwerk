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
          companyName: args.companyName
        }
      },
      info)
    },
    publicPostings: async (_, args, context, info) => {
      const result = await context.prisma.query.postings({
        where: {
          status: 'ACTIVE',
          id: args.id,
        }
      }, info);
      return result;
    },
    internalPostings: async (_, args, context, info) => {
      const { applicationCount, ...rest } = info;
      console.log('context.req.name:', context.req.name);
      console.log('context.req.decoded:', context.req.decoded);
      const result = await context.prisma.query.postings({
        where: {
          offeredBy: {  id: context.req.decoded.id }
        }
      }, info);
      console.log(result);
      return result;
    }
  },
  Mutation: {
    signupEmployer: async (_, args, context, info) => {
      const hashedPassword = await bcrypt.hash(args.adminPassword, 12);
      const employer = await context.prisma.mutation.createEmployer({
        data: {
          contactEmail: args.contactEmail,
          companyName: args.companyName,
        }
      })
      const admin =  await context.prisma.mutation.createUser({
        data: {
          firstName: args.adminFirstName,
          lastName: args.adminLastName,
          email: args.adminEmail,
          hashedPassword: hashedPassword,
          userType: 'EMPLOYER',
          employer: {
            connect: {
              companyName: args.companyName
            }
          }
        }
      })
      return admin;
    },
    signupCandidate: async (_, args, context, info) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const middleNames = typeof args.middleNames === 'string'
        ? args.middleNames.split(' ')
        : [];
      const result = await context.prisma.mutation.createUser({
        data: {
          firstName: args.firstName,
          middleNames,
          lastName: args.lastName,
          email: args.email,
          hashedPassword: hashedPassword,
          userType: 'CANDIDATE',
        }
      })
      if (!result.middleNames) result.middleNames = [];
      return result;
    },
    login: async (_, args, context, info) => {
      const user = await context.prisma.query.user({
        where: {
          email: args.email,
        }
      });
      const AuthorizationError = new Error('User or password incorrect');
      if (!user) {
        console.log('no such user');
        context.res.status(403);
        return AuthorizationError;
      }

      const match = await bcrypt.compare(args.password, user.hashedPassword);
      if (match) {
        let { firstName, lastName, email, userType } = user;
        switch(userType) {
          case 'CANDIDATE':
            console.log('CANDIDATE is logging in');
            return jwt.sign({ firstName, lastName, email, userType }, jwtSecret);
          case 'EMPLOYER':
            console.log('is EMPLOYER!!!');
            console.log('user:', user);
            const employers = await context.prisma.query.employers({
              where: {
                users_some: {
                  email: email
                }
              }
            });
            if (employers.length === 0) {
              context.res.status(403);
              return new Error('User is employertype, but is not in any employers list of users');
            }
            if (employers.length > 1) {
              context.res.status(403);
              return new Error('User attempting to log in is in several employers list of users. What!?');
            }
            console.log('employer:', employers);
            return jwt.sign({ firstName, lastName, email, userType, employer: employers[0] }, jwtSecret);
          default:
            console.log('is nathing');
        }
        return jwt.sign({ name, email, loginType: user.userType}, jwtSecret);
      } else {
        console.log('wrong passw0rd');
        context.res.status(403);
        return AuthorizationError;
      }
    },

    /*  registerApplication(
    applicantId: String!,
    postingId: String!,
    applicationLetter: String!,
  ): Application!*/

      // TODO før dette: Login må sende med ID, candidate login må implementeres
    /*registerApplication: async (_, args, context, info) => {
      const result = await context.prisma.mutation.createApplication({
        data: {
          posting: {
            connect: {
              id: args.postingId,
            }
          },
          applicant: {
            connect: {
              id: context.req.decoded.id
            }
          }
        }
      })
    },*/
    createPosting: async (_, args, context, info) => {
      const result = await context.prisma.mutation.createPosting({
        data: {
          offeredBy: { connect: { id: context.req.decoded.employer.id } },
          postingTitle: args.postingTitle,
          positionTitle: args.positionTitle,
          employmentType: args.employmentType,
          description: args.description,
          customId: `${context.req.decoded.employer.companyName}-${args.customId}`.toLowerCase().replace(' ', '-').trim(),
          createdDate: new Date().toISOString(),
          expiresAt: new Date(args.expiresAt).toISOString(),
          status: args.status || 'UPCOMING'
        }
      });
      return result;
    },
    releasePosting: async (_, args, context, info) => {
      const posting = await context.prisma.query.posting({
        where: {
          customId: args.customId
        }
      }, `{
        id
        offeredBy { id , companyName}
      }`);
      console.log('this is posting:', posting);

      if (posting.offeredBy.id !== context.req.decoded.employer.id) {
        throw new Error('releasePosting: posting with customId has employer.id not matching token employer.id');
      }

      const result = await context.prisma.mutation.updatePosting({
        where: {
          customId: args.customId,
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
  resolvers.Query.internalPostings.name,
  resolvers.Mutation.createPosting.name,
  resolvers.Mutation.releasePosting.name,
  //resolvers.Mutation.registerApplication.name,
];

const expressAuthMiddleware = (req, res, next) => {
  const { query } = req.body;
  const resolver = query.replace('mutation', '').match(/[a-zA-Z0-9_]+/)[0].trim();
  console.log('incoming request to resolver:', resolver);
  if (!privateResolvers.includes(resolver)) {
    console.log('Incoming request does not require authentication');
    return next();
  } else {
    const authorization = req.get('Authorization');
    if (!authorization) return res.status(403).send({ error: 'Token missing' });
    const token = authorization.split(' ')[1];
    if (!token) return res.status(403).send({ error: 'Token missing' });
    if (!jwt.verify(token, jwtSecret)) return res.status(403).send('Token invalid');

    const decoded = jwt.decode(token);
    req.decoded = decoded;
    req.name = decoded.name;
    console.log('middleware has decoded:', decoded);
    next();
  }
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
