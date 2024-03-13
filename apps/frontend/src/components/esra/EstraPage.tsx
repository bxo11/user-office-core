import React from 'react';
import { useParams } from 'react-router';

import { StyledContainer, StyledPaper } from 'styles/StyledComponents';

import DeclareEsra from './DeclareEsra';

export default function EsraPage() {
  const { proposalPk } = useParams<{ proposalPk: string }>();

  if (!proposalPk) {
    return <span>Missing query params</span>;
  }

  return (
    <StyledContainer>
      <StyledPaper>
        <DeclareEsra proposalPk={+proposalPk} />
      </StyledPaper>
    </StyledContainer>
  );
}
