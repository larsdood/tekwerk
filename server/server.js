const { GraphQLServer } = require('graphql-yoga');
const express = require('express');
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
          offeredBy: {  id: context.req.decoded.employer.id }
        }
      }, info);
      console.log(result);
      return result;
    },
    internalPostingDetails: async (_, args, context, info) => {
      console.log('info:', info);
      const posting = await context.prisma.query.postings({
        where: {
          id: args.id,
          offeredBy: { id: context.req.decoded.employer.id }
        }
      }, info);

      if (!posting) {
        throw new Error(`internalPostingDetails: cannot find posting with id ${args.id}`)
      }

      return posting[0];
    },
    messageThreads: async (_, args, context, info) => {
      const threads = await context.prisma.query.messageThreads({
        where: {
          id: args.id,
          users_some: {
            id: context.req.decoded.id
          }
        }
      }, info);

      return threads;
    },
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
        let { id, firstName, lastName, email, userType } = user;
        switch(userType) {
          case 'CANDIDATE':
            console.log('CANDIDATE is logging in');
            return jwt.sign({ id, firstName, lastName, email, userType }, jwtSecret);
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
            return jwt.sign({ id, firstName, lastName, email, userType, employer: employers[0] }, jwtSecret);
          default:
            console.log('is nathing');
        }
        return jwt.sign({ id, name, email, loginType: user.userType}, jwtSecret);
      } else {
        console.log('wrong passw0rd');
        context.res.status(403);
        return AuthorizationError;
      }
    },

    sendApplication: async (_, args, context, info) => {
      const result = await context.prisma.mutation.createApplication({
        data: {
          posting: {
            connect: {
              id: args.postingId,
            }
          },
          applicant: {
            connect: {
              email: context.req.decoded.email,
            }
          },
          applicationLetter: args.applicationLetter,
          status: 'WAITING_FOR_REVIEW',
        }
      });
      return result;
    },

    createPosting: async (_, args, context, info) => {
      const {
        postingTitle,
        positionTitle,
        country,
        city,
        employmentType,
        description,
        minimumSalary,
        maximumSalary,
        currency,
        workingHoursFrom,
        workingHoursTo,
        vacationDays,
        minimumEducation,
        minimumExperience,
        internationalOK,
        hasRelocationAllowance,
        requirements,
        niceToHave,
        tags,
        releaseAt,
        expiresAt
      } = args;
      const result = await context.prisma.mutation.createPosting({
        data: {
          customId: `${context.req.decoded.employer.companyName}-${args.customId}`.toLowerCase().replace(' ', '-').trim(),
          postingTitle,
          positionTitle,
          country,
          city,
          employmentType,
          description,
          minimumSalary,
          maximumSalary,
          currency,
          workingHoursFrom,
          workingHoursTo,
          vacationDays,
          minimumEducation,
          minimumExperience,
          internationalOK,
          hasRelocationAllowance,
          requirements,
          niceToHave,
          // TODO: fix tags
          //tags,
          releaseAt: args.releaseAt ? new Date(args.releaseAt).toISOString() : undefined,
          expiresAt: new Date(args.expiresAt).toISOString(),

          offeredBy: { connect: { id: context.req.decoded.employer.id } },
          createdDate: new Date().toISOString(),
          status: 'UPCOMING',
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
    },
    postMessage: async (_, args, context, info) => {
      // bruke thread mellom args.toId og context.id
      // legge til meldingen og lagre i backend. return nye threaden
      let thread = await context.prisma.query.messageThreads({
        where: {
          users_some: {
            id: context.req.decoded.id,
          }
        }
      });
      console.log('thread:', thread);
      console.log('context.req.decoded:', context.req.decoded);
      console.log('context.req.decoded.id:', context.req.decoded.id);
      console.log('args.toId:', args.toId);
      if (!thread.length) {
        console.log('need to make message thread');
        
        thread = await context.prisma.mutation.createMessageThread({
          data: {
            users: { connect: [{
                id: context.req.decoded.id
              }, {
                id: args.toId
              }]
            }
          }
        })
      } else {
        thread = thread[0];
      }

      const newThread = await context.prisma.mutation.updateMessageThread({
        where: {
          id: thread.id,
        },
        data: {
          messages: {
            create: [{
              from: { connect: { id: context.req.decoded.id }},
              to: { connect: { id: args.toId }},
              sentAt: new Date().toISOString(),
              message: args.message,
            }]
          }
        }
      }, info)

      console.log('thread:', thread);
      console.log('lets return');
      return newThread;
    }
  }
}

const privateResolvers = [
  resolvers.Query.internalPostings.name,
  resolvers.Query.internalPostingDetails.name,
  resolvers.Query.messageThreads.name,
  resolvers.Mutation.createPosting.name,
  resolvers.Mutation.releasePosting.name,
  resolvers.Mutation.sendApplication.name,
  resolvers.Mutation.postMessage.name,
];

const expressAuthMiddleware = (req, res, next) => {
  const { query } = req.body;
  const resolver = query.replace('mutation', '').match(/[a-zA-Z0-9_]+/)[0].trim();
  console.log('request:', resolver);
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

// kan man lage to endepunkter? en med auth og en uten?
server.express.use(cors());
server.express.use(bodyParser.urlencoded({ extended: false }))
server.express.use(gQLbodyParser.graphql())

const production = true;

if (production) {
  server.express.use(express.static('../client/build'))
}

server.express.post(server.options.endpoint, (req, res, next) => expressAuthMiddleware(req, res, next))

const PORT = 4000;
server.start({
  port: PORT,
  endpoint: '/graphql/',
  playground: '/graphql/playground'
}
  , () => console.log('GraphQL yoga server running on ' + PORT))
