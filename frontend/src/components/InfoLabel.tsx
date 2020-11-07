import React from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';

type Props = {
  label: string,
  value: number,
}

const InfoLabel: React.FC<Props> = ({label, value }) => {
  return (
    <Row>
      <LabelText>{label}</LabelText>
      <ValueText>{value}</ValueText>
    </Row>
  )
}

const Row: any = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  border: 3px solid ${ Theme.color.primary };
  border-radius: .4rem;
  background-color: ${ Theme.color.primary };
  margin: 2px;
  max-height: 5rem;
`;

const Text: any = styled.div`
  color: ${Theme.color.secondary};
`;

const LabelText: any = styled(Text)`
  font-size: 2rem;
  flex-basis: 70%;
`;

const ValueText: any = styled(Text)`
  font-size: 3rem;
`;

export default InfoLabel;