// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Message, Room } = initSchema(schema);

export {
  User,
  Message,
  Room
};