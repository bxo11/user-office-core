export enum SafetyLevel {
  GREEN = 1,
  YELLOW,
  RED,
}

export enum EsraStatus {
  ESRA_REQUESTED = 1,
  ESRA_APPROVED,
  ESRA_REJECTED,
}

export class SafetyManagement {
  constructor(
    public id: number,
    public proposalPk: number,
    public safetyLevel: SafetyLevel | null,
    public esraStatus: EsraStatus | null,
    public notes: string | null
  ) {}
}
