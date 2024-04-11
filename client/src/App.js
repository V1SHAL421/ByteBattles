import React from 'react';
import './App.css';
import { ChakraProvider, Center, Divider, Box, Flex, Heading, Text, Image, Badge, Button, Stack, Stat, StatLabel, StatNumber, Input, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCallback } from 'react';
import bytes from './images/bytes.png'

/* Title and login/sign up buttons of gamification platform */
const HomePage = () => (
  
  <React.Fragment>
  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    width='100%'
    pb={60}
    bgColor='lightcyan'
    bgRepeat='no-repeat'
    borderWidth='thick'
    >
    <Stack>
    <Text fontSize="6xl" color="indigo" padding='20'>Welcome To Byte Battles</Text>
    <Text fontSize="4x1" color="violet">
      Here at Byte Battles you can earn badges through correctly answering computer science based multiple choice questions.
    </Text>
    <Text fontSize="4x1" color="violet" textAlign='center'>
    Explore with us into the field of technology!
    </Text>
    <Flex justifyContent="center" alignItems="center" padding="10">
    <Image 
    borderRadius="full"
    boxSize="300px"
    src={bytes}
    alt="Futuristic Bytes"
    />
    </Flex>
    </Stack>
  </Box>

  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    width='100%'
    pt="10"
    pb="60"
    bgColor='lightcyan'
    bgRepeat='no-repeat'
    borderWidth='thick'
    >
    <Stack spacing={4} direction='row' align='center'>
      <Link to="/login"><Button colorScheme='teal' size='lg' variant='solid'>Log In</Button></Link>
      <Link to="/signup"><Button colorScheme='teal' size='lg' variant='solid'>Sign Up</Button></Link>
    </Stack>
  </Box>
  </React.Fragment>




);
/* About Page */
const AboutPage = () => (
  <Box position='relative' padding='10'>
    <Heading textAlign='center' color='darkblue'>
    About Page
    </Heading>
  <Center height='30px'>
    <Divider orientation='vertical' />
  </Center>
    <Text fontSize="xl" color="indigo" padding='5'>
    Our gamification platform aims to make learning engaging and enjoyable by integrating game mechanics into the learning experience. 
    On this platform, users can earn points badges as they answer more and more questions correctly. These rewards serve as incentives to motivate users during the learning process. 
    </Text>
    <Divider />
    <Text fontSize="xl" color="indigo" padding='5'>
    After signing up and logging in, you will be directed to the main page with a question displayed. On the top right is your current progress in the form of your badge ID and the
    number of points needed for the next badge. 
    </Text>
    <Divider />
    <Text fontSize="xl" color="indigo" padding='5'>
    To answer the displayed question, select an option and press "Submit Answer". You may select a different answer before submitting if you change your mind. After submitting, you will receive
    a notification informing you on whether you got the question correct or not. Then you can press the Next Question button. If you got the question correct, upon pressing the Next Question button
    you will gain 100 points. If you reach 0 points needed for the next badge, you receive your new badge!</Text>
  </Box>
);

/* Login page ensuring input data matches data in database */
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

// Navigates to the main page upon successful login otherwise produces error message
  const handleLogin = async (username, password) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL; // URL of the website
      
      const res = await axios.post(`${API_URL}/api/login/login`, { username, password }); // Retrieve user ID from backend
      
      console.log(`Login successful: ${res.data}`);

      navigate("/mainpage", { state: { user_id: res.data.user_id } }); // passes user ID to main page
    } catch (error) {
      console.error(`Login failed: ${error}`);
      setErrorMsg('Login failed - invalid username or password'); // Sets the error message
    }
  };
  
  // Handles cases when log in form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    handleLogin(username, password); 
  };


  

  return (
    <Box>
      <Text fontSize="6xl" color="indigo" mb={4}>Log In Page</Text>
      {errorMsg && <Text color="red.500">{errorMsg}</Text>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={8}
          borderColor="royalblue"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={8}
          borderColor="royalblue"
        />
        <Button type="submit" colorScheme='teal' variant='solid'>Log In</Button>
      </form>
    </Box>
  );

};

/* Sign up page ensuring user details inputted are valid and inserted into database */
const SignUpPage = () => {
  const [formUserData, setFormUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstname: '',
    lastname: '',
  }); // Initialise form user data
  
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormUserData({ ...formUserData, [e.target.name]: e.target.value });
  }; // Handles changes in form user data through key value pairs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const API_URL = process.env.REACT_APP_API_URL;// URL of the website
      
      const res = await axios.post(`${API_URL}/api/login/sign_up`, formUserData); // Retrieve user ID from backend
      
      toast({
        title: "Sign up successful",
        description: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      toast({ title: "Sign up failed", description: "An error occurred. Please try again.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Sign Up</Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Input placeholder="Username" name="username" value={formUserData.username} borderColor="royalblue" onChange={handleChange} />
          <Input placeholder="Email" type="email" name="email" value={formUserData.email} borderColor="royalblue" onChange={handleChange} />
          <Input placeholder="First Name" name="firstname" value={formUserData.firstname} borderColor="royalblue" onChange={handleChange} />
          <Input placeholder="Last Name" name="lastname" value={formUserData.lastname} borderColor="royalblue" onChange={handleChange} />
          <Input placeholder="Password" type="password" name="password" value={formUserData.password} borderColor="royalblue" onChange={handleChange} />
          <Input placeholder="Confirm Password" type="password" name="confirmPassword" value={formUserData.confirmPassword} borderColor="royalblue" onChange={handleChange} />
          <Button type="submit" colorScheme='teal' variant='solid' isLoading={isLoading}>Sign Up</Button>
        </Stack>
      </form>
    </Box>
  );
};




const MainPage = () => {
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [badgeId, setBadgeId] = useState(null);
  const [pointsNeeded, setPointsNeeded] = useState(null);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const location = useLocation();
  const toast = useToast();
  const { user_id } = location.state || {};

  const API_URL = process.env.REACT_APP_API_URL; // URL of the website


  const fetchBadgeID = useCallback(async () => {
    try {
      const badgeRes = await axios.get(`${API_URL}/api/badge/badge_id`, { params: { id: user_id } }); // Retrieve badge ID from backend
      const pointsRes = await axios.get(`${API_URL}/api/badge/points_needed/${user_id}`);  // Retrieve points needed from backend

      setBadgeId(badgeRes.data.badge_id); // Sets badge ID
      setPointsNeeded(pointsRes.data.pointsNeeded); // Sets points needed

    } catch (error) {
      toast({ // Handles error
        title: "Error",
        description: "Failed to fetch user badge details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [API_URL, user_id, toast]);

  // Update Badge Details if points needed hits 0
  const updateBadgeIDIfNeeded = useCallback(async () => {
    if (pointsNeeded === 0) {
      try {
        await axios.put(`${API_URL}/api/badge/badge_id/${user_id}`);
        await axios.put(`${API_URL}/api/badge/points_needed/${user_id}`);
        await fetchBadgeID(); // Refetch badge details
      } catch (error) {
        toast({
          title: "Update Error",
          description: "There was a problem updating your badge details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [API_URL, user_id, pointsNeeded, toast, fetchBadgeID]);

  // Check if pointsNeeded is 0 and if so will increment badge ID
  useEffect(() => {
    updateBadgeIDIfNeeded();
  }, [pointsNeeded, updateBadgeIDIfNeeded]);

  // Display Question
  const displayQuestion = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/quiz/questions`, { params: { user_id } }); //Retrieves random question from backend

      setQuestion(res.data.question); // Sets question name, content, options and answer
      setSelectedOption(null);
      setFeedbackMsg('');
      setShowNextQuestionButton(false) // Disables next question button

      // Fetch badge ID after displaying a new question
      await fetchBadgeID();
    } catch (error) {
      console.error(`Retrieval of random question failed: ${error}`);
      toast({
        title: "Error",
        description: "Failed to retrieve the question.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [API_URL, user_id, toast, fetchBadgeID]);

  // Submit Answer
  const submitAnswer = useCallback(async () => {
    if (selectedOption === null) { // Handles case when no answers are selected
      toast({
        title: "No Selection",
        description: "Please select an option before submitting.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/quiz/questions/quiz/${encodeURIComponent(question.question_name)}/${user_id}`, {
        selected_option: selectedOption,
      });  // If the selected option is correct, points needed are reduced by 100 (if no more points then badge is incremented by 1 and points reset to 1000)

      setFeedbackMsg(res.data.Message);

      if (res.data.Message === "Correct answer") {
        toast({ // Display congratulations for correct answer
          title: "Correct!",
          description: "Well done!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Incorrect!",
          description: `Correct answer: ${res.data.correctAnswer}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setShowNextQuestionButton(true); // Show "Next Question" button
    } catch (error) { // Notify user of the correct answer if they were wrong
      console.error(`Error submitting answer: ${error}`);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your answer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [API_URL, user_id, selectedOption, question, toast]);

  useEffect(() => {
    if (user_id) {
      displayQuestion();  // Display question if user is logged in
    }
  }, [user_id, displayQuestion]);

  return (
    <>
      <Box position="absolute" top="4" right="4" p="4" bgColor="whiteAlpha.900" borderRadius="lg" shadow="md">
        <VStack spacing={3}>
          <Badge colorScheme="purple" variant="solid" fontSize="1em" px={2} py={1} borderRadius="full">
            Badge {badgeId}
          </Badge>
          <Stat>
            <StatLabel>Points Needed</StatLabel>
            <StatNumber>{pointsNeeded}</StatNumber>
          </Stat>
        </VStack>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width='100%'
        pb="500"
        bgColor='turquoise'
        bgPosition='center'
        bgRepeat='no-repeat'
        height="100vh"
        mb={2}
      >
        <Text fontSize="6xl" mb={4} color="indigo">Here is your next question!</Text>
        {question && (
          <>
            <Text fontSize="4xl" color="white" mb={4}>{question.question_content}</Text>
            <VStack spacing={4}>
              <Button
                colorScheme={selectedOption === 1 ? 'orange' : 'teal'}
                onClick={() => setSelectedOption(1)}
              >
                1. {question.option_one}
              </Button>
              <Button
                colorScheme={selectedOption === 2 ? 'orange' : 'teal'}
                onClick={() => setSelectedOption(2)}
              >
                2. {question.option_two}
              </Button>
              <Button
                colorScheme={selectedOption === 3 ? 'orange' : 'teal'}
                onClick={() => setSelectedOption(3)}
              >
                3. {question.option_three}
              </Button>
              <Button
                colorScheme={selectedOption === 4 ? 'orange' : 'teal'}
                onClick={() => setSelectedOption(4)}
              >
                4. {question.option_four}
              </Button>
            </VStack>
            <Button mt={4} colorScheme='cyan' onClick={submitAnswer} isDisabled={showNextQuestionButton}>
              Submit Answer
            </Button>
            {showNextQuestionButton && (
              <Button mt={4} colorScheme='green' onClick={displayQuestion}>
                Next Question
              </Button>
            )}
            {feedbackMsg && <Text fontSize="2xl" color="white" mt={4}>{feedbackMsg}</Text>}
          </>
        )}
      </Box>
    </>
  );
};







function App() {


  return (
    <Router>
      <ChakraProvider>
        <Box as="nav">
          <Stack spacing={4} direction='row' align='center'>
            <Link to="/"><Button colorScheme='teal' size='lg' variant='outline'>Home</Button></Link>
            <Link to="/about"><Button colorScheme='teal' size='lg' variant='outline'>About</Button></Link>
          </Stack>
        </Box>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/mainpage" element={<MainPage />} />
        </Routes>
      </ChakraProvider>
    </Router>
  );
}

export default App;



