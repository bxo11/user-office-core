import faker from 'faker';

context('Samples tests', () => {
  before(() => {
    cy.resetDB();
  });

  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1100, 1000);
  });

  const proposalTemplateName = faker.lorem.words(2);
  const sampleTemplateName = faker.lorem.words(2);
  const sampleTemplateDescription = faker.lorem.words(4);
  const sampleQuestion = faker.lorem.words(4);
  const proposalTitle = faker.lorem.words(2);
  const safetyComment = faker.lorem.words(5);
  const sampleTitle = faker.lorem.words(2);
  const proposalTitleUpdated = faker.lorem.words(2);

  it('Should be able to create proposal template with sample', () => {
    cy.login('officer');

    cy.navigateToTemplatesSubmenu('Sample declaration templates');

    cy.get('[data-cy=create-new-button]').click();

    cy.get('[data-cy=name] input')
      .type(sampleTemplateName)
      .should('have.value', sampleTemplateName);

    cy.get('[data-cy=description]').type(sampleTemplateDescription);

    cy.get('[data-cy=submit]').click();

    cy.contains('New sample');

    cy.visit('/');

    cy.navigateToTemplatesSubmenu('Proposal templates');

    cy.get('[data-cy=create-new-button]').click();

    cy.get('[data-cy=name] input')
      .type(proposalTemplateName)
      .should('have.value', proposalTemplateName);

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=show-more-button]')
      .last()
      .click();

    cy.get('[data-cy=add-topic-menu-item]')
      .last()
      .click();

    cy.get('[data-cy=show-more-button]')
      .last()
      .click();

    cy.get('[data-cy=add-question-menu-item]')
      .last()
      .click();

    cy.get('[data-cy=questionPicker] [data-cy=show-more-button]').click();

    cy.contains('Add Subtemplate').click();

    cy.get('[data-cy=question]')
      .clear()
      .type(sampleQuestion)
      .should('have.value', sampleQuestion);

    cy.get('[data-cy=template-id]').click();

    cy.contains(sampleTemplateName).click();

    cy.contains('Save').click();

    cy.get('body').type('{alt}', { release: false });

    cy.contains(sampleQuestion).click();

    // now check if the question that was ALT-clicked was moved away from question list
    cy.get('[data-cy=close-button]').click(); // closing question list

    cy.contains(sampleQuestion); // checking if question in the topic column
  });

  it('Should be possible to change template in a call', () => {
    cy.login('officer');

    cy.contains('Calls').click();

    cy.get('[title="Edit"]').click();

    cy.get('[data-cy=call-template]').click();

    cy.contains(proposalTemplateName).click();

    cy.get('[data-cy="next-step"]').click();

    cy.get('[data-cy="next-step"]').click();

    cy.get('[data-cy="submit"]').click();
  });

  it('Should be able to create proposal with sample', () => {
    cy.login('user');

    cy.createProposal();

    cy.get('[data-cy=add-button]').click();

    cy.get('[data-cy=title-input] input')
      .clear()
      .type(sampleTitle)
      .should('have.value', sampleTitle);

    cy.get(
      '[data-cy=sample-declaration-modal] [data-cy=save-and-continue-button]'
    ).click();

    cy.get('[data-cy="questionaries-list-item"]').should('have.length', 1);

    cy.get('[data-cy="clone"]').click();

    cy.get('[data-cy="questionaries-list-item"]').should('have.length', 2);

    cy.get('[data-cy="delete"]')
      .eq(1)
      .click();

    cy.get('[data-cy="questionaries-list-item"]').should('have.length', 1);

    cy.contains('Save and continue').click();

    cy.contains('Submit').click();

    cy.contains('OK').click();
  });

  it('Officer should be able to edit proposal', () => {
    cy.login('officer');

    cy.contains('Proposals').click();

    cy.get('[title="View proposal"]').click();

    cy.contains('Edit proposal').click();

    cy.contains('New proposal').click();

    cy.get('[data-cy=title] input')
      .clear()
      .type(proposalTitleUpdated)
      .should('have.value', proposalTitleUpdated);

    cy.get('[data-cy=save-and-continue-button]').click();

    cy.contains('Close').click();

    cy.contains(proposalTitleUpdated);
  });

  it('Should be able to evaluate sample', () => {
    cy.login('officer');

    cy.contains('Sample safety').click();

    cy.get('[title="Review sample"]')
      .last()
      .click();

    cy.get('[data-cy="safety-status"]').click();

    cy.contains('Low risk').click();

    cy.get('[data-cy="safety-comment"]').type(safetyComment);

    cy.get('[data-cy="submit"]').click();

    cy.wait(500);

    cy.reload();

    cy.get('[title="Review sample"]')
      .last()
      .click();

    cy.contains(safetyComment); // test if comment entered is present after reload

    cy.get('[data-cy="safety-status"]').click();

    cy.contains('High risk').click();

    cy.get('[data-cy="submit"]').click();

    cy.contains('HIGH_RISK'); // test if status has changed
  });

  it('Check if link for download samples is created with the correct attributes', () => {
    cy.login('officer');

    cy.contains('Sample safety').click();

    cy.document().then(document => {
      const observer = new MutationObserver(function() {
        const [mutationList] = arguments;
        for (const mutation of mutationList) {
          for (const child of mutation.addedNodes) {
            if (child.nodeName === 'A') {
              expect(child.href).to.contain('/download/sample/1');
              expect(child.download).to.contain('download');
            }
          }
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      observer.disconnect();
    });

    cy.get('[data-cy="download-sample"]')
      .first()
      .click();
  });

  it('Should be able to download sample pdf', () => {
    cy.login('officer');

    cy.contains('Sample safety').click();

    cy.request('GET', '/download/sample/1').then(response => {
      expect(response.headers['content-type']).to.be.equal('application/pdf');
      expect(response.status).to.be.equal(200);
    });
  });

  it('Officer should able to delete proposal with sample', () => {
    cy.login('officer');

    cy.contains('Proposals').click();

    cy.get("input[type='checkbox']")
      .first()
      .click();

    cy.get("[title='Delete proposals']")
      .first()
      .click();

    cy.get('.MuiDialog-root')
      .contains('Yes')
      .click();

    cy.contains(proposalTitle).should('not.exist');
  });
});
