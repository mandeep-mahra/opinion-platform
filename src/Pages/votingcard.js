import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { votedFor, updateData, getVoteCount } from '../firebase';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function VotingCard({  heading, uploader, options, id, email }) {
  const [realOptions, setRealOptions] = useState([]);
  const [data, setData] = useState([]);
  const [votedForOption, setVotedOptionFor] = useState("");
  const [selOption, setSelOption] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = (option) => {
    setVotedOptionFor(option);
    setSelectedOption(option);
    updateData(id, email, option).then(() => {
      setData([]);
      options.forEach(option => {
        const filterOptionName = option.mapValue.fields.data.mapValue.fields.optionName.stringValue;
        const filterOptionURL =  option.mapValue.fields.data.mapValue.fields.optionURL.stringValue;
        getVoteCount(id, filterOptionName).then((res) => {
          setData((currData) => {
            return [
              {
                name : filterOptionName,
                votes : res,
              },
              ...currData
            ]
          })
        })
      })
    });
    setSelOption(option);
  };

  useEffect(()=>{
    options.forEach(option => {
      const filterOptionName = option.mapValue.fields.data.mapValue.fields.optionName.stringValue;
      const filterOptionURL =  option.mapValue.fields.data.mapValue.fields.optionURL.stringValue;
      getVoteCount(id, filterOptionName).then((res) => {
        setData((currData) => {
          return [
            {
              name : filterOptionName,
              votes : res,
            },
            ...currData
          ]
        })
      })
      setRealOptions((currOptions) => {
        return (
          [
            {
              title : filterOptionName,
              image : filterOptionURL
            },
            ...currOptions
          ]
        )
      })
      votedFor(id, email).then((res) => {
        setVotedOptionFor(res);
      })
    });
  },[])

  useEffect(()=>{
    
  },[selOption])

  return (
    <Card className="p-3 container-sm voting-card mb-5 w-50 h-100 d-flex align-items-center justify-content-center">
      <Card.Body>
        <Card.Header><h4>{uploader + " posted..."}</h4></Card.Header>
        <Card.Title className = "p-3 mt-3"><h4>{heading}</h4></Card.Title>
        <Form className = "mt-3 p-3">
          <Row className = "w-100 p-3">
            {realOptions.map((option, index) => (
              <Col key={index} md={9} className="mb-3 p-3">
                  <Form.Check
                    type="radio"
                    id={option.title + index}
                    label={
                      <>
                        <img
                          src={option.image}
                          alt={option.title}
                          height = "175vw"
                          className="option-image ms-2"
                        />
                        <br></br>
                        <h4>{option.title}</h4>
                      </>
                    }
                    value={option.title}
                    checked={(selectedOption === option.title) || 
                             (option.title === votedForOption)}
                    onChange={() => handleVote(option.title)}
                  />
                
              </Col>
            ))}
          </Row>
        </Form>
        <Card.Footer>
          {selectedOption && <p>You voted for: {selectedOption}</p>}
          {(data.length > 0) ? 
          <ResponsiveContainer width="100%" height={200}>
            <BarChart  data={data}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          : <>Loading Graph...</>}
          
        </Card.Footer>
      </Card.Body>
    </Card>
  );
}
