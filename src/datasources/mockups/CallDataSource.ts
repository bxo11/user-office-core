import { Call } from '../../models/Call';
import { CreateCallArgs } from '../../resolvers/mutations/CreateCallMutation';
import { CallDataSource } from '../CallDataSource';
import { CallsFilter } from './../../resolvers/queries/CallsQuery';

export const dummyCall = new Call(
  1,
  'shortCode',
  new Date('2019-07-17 08:25:12.23043+00'),
  new Date('2019-07-17 08:25:12.23043+00'),
  new Date('2019-07-17 08:25:12.23043+00'),
  new Date('2019-07-17 08:25:12.23043+00'),
  new Date('2019-07-17 08:25:12.23043+00'),
  new Date('2019-07-17 08:25:12.23043+00'),
  '',
  ''
);

export class CallDataSourceMock implements CallDataSource {
  async get(id: number): Promise<Call | null> {
    return dummyCall;
  }

  async getCalls(filter?: CallsFilter): Promise<Call[]> {
    return [dummyCall];
  }
  async create(args: CreateCallArgs) {
    return dummyCall;
  }
}
