import logo from './logo.svg';
import './App.css';
import WeatherDashboard from './pages/home/index';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <WeatherDashboard></WeatherDashboard>
    </ChakraProvider>
  );
}

export default App;
