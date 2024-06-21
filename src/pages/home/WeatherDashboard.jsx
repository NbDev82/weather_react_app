import React, { useEffect, useState } from 'react';
import './WeatherDashboard.scss';
import { Input, Button, Box, Divider, AbsoluteCenter, Heading, IconButton } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Card, CardBody, Image, Stack, Text, Flex  } from '@chakra-ui/react';

const WeatherDashboard = () => {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState()
  const [histories, setHistories] = useState()

  const fetchWeatherData = async () => {
    try {
      // console.log(`https://weather-api-app-ruby-ca24058ecac9.herokuapp.com/api/v1/weathers?location=` + location)
      const response = await axios.get(`http://127.0.0.1:3001/api/v1/weathers?location=` + location);
      setWeather(response.data);
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const fetchWeatherDataOnCurrentLocation = async () => {
    try {
      const response_ip = await axios.get('https://api.ipify.org?format=json');
      const ip = response_ip.data['ip']
      const location_response = await axios.get(`http://127.0.0.1:3001/api/v1/weathers/location?ip=` + ip);
      const response = await axios.get(`http://127.0.0.1:3001/api/v1/weathers?location=` + location_response.data);
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
      const response = await axios.get(`http://127.0.0.1:3001/api/v1/weathers/forecast?location=` + location + '&quantity='+quantity);
      
      const newList = [...weather.forecast_weathers, ...response.data ]
      setWeather({ ...weather, forecast_weathers: newList });
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/api/v1/weathers/history?location=` + location);
      console.log(response.data)
      setHistories(response.data)
    } catch (error) {
      window.alert(error.response.data.error)
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  }

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
              w={'98.5%'}
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
              <Box overflowX="auto" maxHeight='300px' padding="2px" border="3px solid" borderColor="black">
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
                  <Box overflowX="auto" maxHeight='300px' padding="2px" border="3px solid" borderColor="black">
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
