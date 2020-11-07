import React, { useState } from 'react'
import styled from 'styled-components'

import { Theme } from '../styles'

const Feedback:React.FC = () => {
  const [input, setInput] = useState<string>('')

  const handleInput = (event) => {
    event.target.value.length <= 20 && setInput(event.target.value)
  }

  
  return (
    <Col>
      <Heading>Give your unique id</Heading>
      <Input value={input} onChange={handleInput}/>
      <Button>Next</Button>
    </Col>
  )
}


const Col: any = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  align-items: center;
`

const Heading: any = styled.h1`
  
`

const Input: any = styled.input`
  background-color: ${ Theme.color.tertiary };
  border: 3px solid ${ Theme.color.primary };
  color: ${ Theme.color.primary };
  border-radius: 1rem;
  height: 2rem;
  text-align: center;
  outline: none;
  font-size: 1.5rem;
`

const Button: any = styled.button`
  background-color: ${ Theme.color.primary };
  color: ${ Theme.color.secondary };
  border: 3px solid ${ Theme.color.primary };
  border-radius: 1rem;
  padding: .3rem;
  width: 90px;
  margin-top: 10px;
  font-size: 1.2rem;
`



export default Feedback