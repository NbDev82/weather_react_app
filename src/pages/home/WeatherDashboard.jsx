import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import './WeatherDashboard.scss';
import { Input, Button, Box, Divider, AbsoluteCenter, Heading, IconButton, HStack } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Card, CardBody, Image, Stack, Text, Flex  } from '@chakra-ui/react';
import {FormErrorMessage, FormControl } from '@chakra-ui/react';

const WeatherDashboard = () => {
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('');
  const [weather, setWeather] = useState()
  const [histories, setHistories] = useState()

  // const base_uri = 'https://weather-api-app-ruby-ca24058ecac9.herokuapp.com'
  const base_uri = 'http://127.0.0.1:3001'

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(base_uri+`/api/v1/weathers?` + queryString.stringify({ location: location }));
      setWeather(response.data);
      setHistories(null)
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const fetchWeatherDataOnCurrentLocation = async () => {
    try {
      const response_ip = await axios.get('https://api.ipify.org?format=json');
      const ip = response_ip.data['ip']
      const location_response = await axios.get(base_uri+`/api/v1/weathers/location?`+ queryString.stringify({ ip: ip }));
      const response = await axios.get(base_uri+`/api/v1/weathers?`+queryString.stringify({ location: location_response.data }));
      setLocation(location_response.data)
      setWeather(response.data);
      setHistories(null)
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const forecastWeatherData = async () => {
    try {
      const quantity = weather.forecast_weathers.length
      const response = await axios.get(base_uri+`/api/v1/weathers/forecast?` + queryString.stringify({ quantity: quantity , location: location}));
      
      const newList = [...weather.forecast_weathers, ...response.data ]
      setWeather({ ...weather, forecast_weathers: newList });
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(base_uri+`/api/v1/weathers/history?` + queryString.stringify({ location: location }));
      console.log(response.data)
      setHistories(response.data)
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  }

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    
    if (!isValidEmail(value)) {
      setError('Invalid email address');
    } else {
      setError('');
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const register = async () => {
    try {
      if (isValidEmail(email) && location !== '') {
        const response = await axios.get(base_uri+`/api/v1/mailers/register?`+ queryString.stringify({ email: email, location: location }));
        window.alert(response.data.message)
      } else {
        setError('Invalid email address or location is not provided');
      }
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const unsubscribe = async () => {
    try {
      if (isValidEmail(email)) {
        const response = await axios.get(base_uri+`/api/v1/mailers/unsubscribe?`+ queryString.stringify({ email: email }));
        window.alert(response.data.message)
      } else {
        setError('Invalid email address');
      }
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };


  return (
    <div className="app">
      <div className="nav">
        <Heading as="h4" size="md">
          Weather Dashboard
        </Heading>
      </div>
      <div className="container">
        <div className="container--search">
          <div className="container--search__inputgroup">
            <Heading as="h3" size="xs">
              Enter a City Name
            </Heading>

            <Input 
              variant="outline" 
              h={'40px'} 
              placeholder="E.g, New York, London, Tokyo" 
              backgroundColor={'white'} 
              value={location}
              onChange={handleLocationChange}
            />
          </div>
          <Button bg={'#5372EF'} color={'white'} w={'100%'} h={'40px'} onClick={fetchWeatherData} _hover={{ cursor: 'pointer' }}>
            Search
          </Button>
          <Box position="relative" w={'100%'} padding="10">
            <Divider borderColor="gray" borderWidth="1px" />
            <AbsoluteCenter bg="#d7eaff" px="4" color={'gray'}>
              Or
            </AbsoluteCenter>
          </Box>
          <Button bg="#6C757E" color={'white'} w={'100%'} h={'40px'} _hover={{ cursor: 'pointer' }} onClick={fetchWeatherDataOnCurrentLocation}>
            Use current location
          </Button>
          <Box position="relative" w={'100%'} padding="10">
            <Divider borderColor="gray" borderWidth="1px" />
            <AbsoluteCenter bg="#d7eaff" px="4" color={'gray'}>
              Or
            </AbsoluteCenter>
          </Box>
          <Button bg="#6C757E" color={'white'} w={'100%'} h={'40px'} _hover={{ cursor: 'pointer' }} onClick={fetchHistory}>
            History during day
          </Button>

          <Box position="relative" w={'100%'} padding="10">
            <Divider borderColor="gray" borderWidth="1px" />
            <AbsoluteCenter bg="#d7eaff" px="4" color={'gray'}>
              Or
            </AbsoluteCenter>
          </Box>
          <div className="container--search__inputgroup">
            <Heading as="h3" size="xs">
              Do you want to sign up for notifications?
            </Heading>

            <FormControl isInvalid={!!error}>
              <Input
                variant="outline"
                h="40px"
                placeholder="Type your email"
                backgroundColor="white"
                value={email}
                onChange={handleEmailChange}
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </div>
          <HStack spacing={4} w="100%">
      <Button
        bg="#5372EF"
        color="white"
        w="100%"
        h="40px"
        onClick={register}
        _hover={{ cursor: 'pointer' }}
      >
        Register
      </Button>
      <Button
        bg="#6C757E"
        color="white"
        w="100%"
        h="40px"
        onClick={unsubscribe}
        _hover={{ cursor: 'pointer' }}
      >
        Unsubscribe
      </Button>
    </HStack>

        </div>
        {weather && (
          <div className="container--result">
            <div className="container--result__weatherlocation">
              <div className="container--result__weatherlocation--child">
                <Heading as="h3" size="lg">
                  {weather.current_weather.location} {'('}
                  {weather.current_weather.date}
                  {')'}
                </Heading>
                <p>Temperature: {weather.current_weather.temperature}</p>
                <p>Wind: {weather.current_weather.wind} </p>
                <p>Humidity: {weather.current_weather.humidity}</p>
              </div>
              <div className="container--result__weatherlocation--child">
                <Heading as="h1" size="4xl">
                  <img src={weather.current_weather.url_img} alt="Fetched" />
                </Heading>
                <p>{weather.current_weather.condition}</p>
              </div>
            </div>

            <div className="container--result__title" padding='2px'>
              <Heading as="h2" size="md">
                4-Day Forecast
              </Heading>
            </div>
            <div className="container--result__weather4day">
              <Box overflowX="auto" maxHeight='250px' padding="2px">
                <Flex gap="10px" flexWrap="wrap">
                  {weather.forecast_weathers.map((weatherday, index) => (
                    <Card key={index} maxW='sm' className="container--result__weather4day--child">
                      <CardBody>
                        <Heading size='md'>
                          {'('}
                          {weatherday.date}
                          {')'}
                        </Heading>
                        <Image
                          src={weatherday.url_img}
                          alt='Green double couch with wooden legs'
                          borderRadius='lg'
                        />
                        <Stack mt='6' spacing='3'>
                          <Text>
                            Temperature: 
                            {weatherday.temperature}
                          </Text>
                          <Text>
                            Wind: {weatherday.wind}
                          </Text>
                          <Text>
                            Humidity: {weatherday.humidity}
                          </Text>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Flex>
              </Box>

              <IconButton 
                bg={'transparent'} 
                fontSize="20px" 
                icon={<ArrowRightIcon 
                color={'#6C757E'} />} 
                onClick={forecastWeatherData} 
                _hover={{ cursor: 'pointer' }}
                />
            </div>

            {histories && (
              <div>
                <div className="container--result__title" style={{ marginBottom: '10px', padding: '2px' }}>
                  <Heading as="h2" size="md">
                    History during day
                  </Heading>
                </div>
                <div className="container--result__weather4day" style={{ marginBottom: '50px', padding: '2px' }}>
                  <Box overflowX="auto" maxHeight='250px' padding="2px">
                    <Flex gap="10px" flexWrap="wrap">
                      {histories.map((history, index) => (
                        <Card key={index} maxW='sm' className="container--result__weather4day--child">
                          <CardBody>
                            <Heading size='md'>
                              {'('}
                              {history.date}
                              {')'}
                            </Heading>
                            <Image
                              src={history.url_img}
                              alt='Green double couch with wooden legs'
                              borderRadius='lg'
                            />
                            <Stack mt='6' spacing='3'>
                              <Text>
                                Temperature: 
                                {history.temperature}
                              </Text>
                              <Text>
                                Wind: {history.wind}
                              </Text>
                              <Text>
                                Humidity: {history.humidity}
                              </Text>
                            </Stack>
                          </CardBody>
                        </Card>
                      ))}
                    </Flex>
                  </Box>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
