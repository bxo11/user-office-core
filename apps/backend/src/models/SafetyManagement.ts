export class SafetyManagement {
  constructor(
    public id: number,
    public proposalPk: number,
    public safetyLevel: number | null,
    public notes: string | null
  ) {}
}
