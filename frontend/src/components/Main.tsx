import React, { useState } from 'react';
import styled from 'styled-components';

import InfoLabel from './InfoLabel';

import { Theme } from '../styles';

type Props = {}

const Main: React.FC<Props> = ({ }) => {

  const [soldToday, setSoldToday] = useState(0)
  const [soldYesterday, setSoldYesterday] = useState(0)
  const [soldLastMonth, setSoldLastMonth] = useState([])

  return (
    <Col>
      <Col>
        <Heading>Product X</Heading>
        <Container>
          <InfoLabel label={'sold today'} value={20}/>
          <InfoLabel label={'sold yesterday'} value={100}/>
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
  font-size: 3rem;
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
