import {
  AssignChairOrSecretaryMutation,
  AssignChairOrSecretaryMutationVariables,
  CreateSepMutation,
  CreateSepMutationVariables,
  AssignReviewersToSepMutationVariables,
  AssignReviewersToSepMutation,
  AssignProposalsToSepMutation,
  AssignProposalsToSepMutationVariables,
} from '../../src/generated/sdk';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Creates new sep with values passed.
       *
       * @returns {typeof createSep}
       * @memberof Chainable
       * @example
       *    cy.createSep(newSepInput: CreateSepMutationVariables)
       */
      createSep: (
        newSepInput: CreateSepMutationVariables
      ) => Cypress.Chainable<CreateSepMutation>;

      /**
       * Assign chair or secretary to existing sep.
       *
       * @returns {typeof assignChairOrSecretary}
       * @memberof Chainable
       * @example
       *    cy.assignChairOrSecretary(assignChairOrSecretaryInput: AssignChairOrSecretaryMutationVariables)
       */
      assignChairOrSecretary: (
        assignChairOrSecretaryInput: AssignChairOrSecretaryMutationVariables
      ) => Cypress.Chainable<AssignChairOrSecretaryMutation>;

      /**
       * Assign reviewers to existing sep.
       *
       * @returns {typeof assignReviewersToSep}
       * @memberof Chainable
       * @example
       *    cy.assignReviewersToSep(assignReviewersToSepInput: AssignReviewersToSepMutationVariables)
       */
      assignReviewersToSep: (
        assignReviewersToSepInput: AssignReviewersToSepMutationVariables
      ) => Cypress.Chainable<AssignReviewersToSepMutation>;

      /**
       * Assign proposals to existing sep.
       *
       * @returns {typeof assignProposalsToSep}
       * @memberof Chainable
       * @example
       *    cy.assignProposalsToSep(assignProposalsToSepInput: AssignProposalsToSepMutationVariables)
       */
      assignProposalsToSep: (
        assignProposalsToSepInput: AssignProposalsToSepMutationVariables
      ) => Cypress.Chainable<AssignProposalsToSepMutation>;
    }
  }
}

export {};
