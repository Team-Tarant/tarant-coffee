import React, { useState, Fragment } from 'react'
import styled from 'styled-components'

import { Theme } from '../styles'

const Feedback:React.FC = () => {
  const [id, setId] = useState<string>('')
  const [validId, setValidId] = useState<Boolean>(false)

  const handleInput = (event) => {
    event.target.value.length <= 20 && setId(event.target.value)
  }

  const submitId = () => {
    console.log('id submit', id)
    setValidId(true)
  }

  const submitFeedback = (rating: number) => {
    console.log('submitted feedback')
  }
  
  return (
      <Col>
        {validId ?
          <Fragment>
            <Heading>Give your unique id</Heading>
            <Input value={id} onChange={handleInput}/>
            <Button onClick={submitId}>Next</Button>
          </Fragment>
        : <Fragment>
            <Heading>How did you enjoy your Paulig experience?</Heading>
            <FeedbackRow>
              <FeedbackButton onClick={() => submitFeedback(-1)}>💩</FeedbackButton>
              <FeedbackButton onClick={() => submitFeedback(0)}>🤷‍♀️</FeedbackButton>
              <FeedbackButton onClick={() => submitFeedback(1)}>😋</FeedbackButton>
            </FeedbackRow>
          </Fragment>}
      </Col>
  )
}


const Col: any = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  align-items: center;
`

const Heading: any = styled.h1`
  text-align: center;
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
  outline: none;
`

const FeedbackRow: any = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 10%;
`

const FeedbackButton: any = styled.button`
  height: 80px;
  width: 80px;
  font-size: 2rem;
  background-color: ${ Theme.color.tertiary };
  border: 3px solid ${ Theme.color.primary };
  border-radius: 1rem;
`



export default Feedback