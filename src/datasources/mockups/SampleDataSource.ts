import { Sample, SampleStatus } from '../../models/Sample';
import { SamplesArgs } from '../../resolvers/queries/SamplesQuery';
import { SampleDataSource } from '../SampleDataSource';

export class SampleDataSourceMock implements SampleDataSource {
  samples: Sample[];
  public init() {
    this.samples = [
      new Sample(1, 'title', 1, 1, SampleStatus.SAFE, new Date()),
    ];
  }
  async getSamples(args: SamplesArgs): Promise<Sample[]> {
    return this.samples;
  }
  async getSamplesByAnswerId(answerId: number): Promise<Sample[]> {
    return this.samples;
  }
  async getSamplesByCallId(callId: number): Promise<Sample[]> {
    return this.samples;
  }
  async create(
    questionaryId: number,
    title: string,
    creatorId: number
  ): Promise<Sample> {
    return new Sample(
      1,
      title,
      creatorId,
      questionaryId,
      SampleStatus.NONE,
      new Date()
    );
  }
}
