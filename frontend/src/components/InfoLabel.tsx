import React from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';

type Props = {
  label: string,
  value?: number | string,
}

const InfoLabel: React.FC<Props> = ({ label, value }) => {
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
  border-radius: .4rem;
  margin: 2px;
  max-height: 5rem;
  padding: 0.2rem;
  background-color: ${Theme.color.tertiary};
  padding: 7px;
`;

const Text: any = styled.div`
  color: ${Theme.color.primary};
`;

const LabelText: any = styled(Text)`
  font-size: 1rem;
  flex-basis: 70%;
`;

const ValueText: any = styled(Text)`
  margin-left: 1rem;
  font-size: 2rem;
`;

export default InfoLabel;