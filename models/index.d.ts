import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class User {
  readonly id: string;
  readonly username?: string;
  readonly roomID?: string;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class Message {
  readonly id: string;
  readonly content?: string;
  readonly timestamp?: number;
  readonly author?: string;
  readonly roomID?: string;
  constructor(init: ModelInit<Message>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}

export declare class Room {
  readonly id: string;
  readonly Messages?: (Message | null)[];
  readonly Users?: (User | null)[];
  constructor(init: ModelInit<Room>);
  static copyOf(source: Room, mutator: (draft: MutableModel<Room>) => MutableModel<Room> | void): Room;
}