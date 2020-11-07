import React from 'react';
import styled from 'styled-components';

import InfoLabel from './InfoLabel';

import { Theme } from '../styles';

type Props = {}

const Main: React.FC<Props> = ({ }) => {

  return (
    <Col>
      <Col>
        <Heading>Product X</Heading>
        <Container>
          <InfoLabel label={'sold today'} value={20}/>
          <InfoLabel label={'sold yesterday'} value={100}/>
          <InfoLabel label={'Interesting but very, very long value label asdfasdf ölkj js lekals jdkje lkasj k'} value={100}/>
        </Container>
      </Col>
    </Col>
  )
}

const Col: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;
`;


const Container: any = styled.div`
  display: flex;
  margin: 5px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const Heading: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.secondary};
  font-size: 7rem;
  margin: 0;
`;

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/loading.svg'),
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;
