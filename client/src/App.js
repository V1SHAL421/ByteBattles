import React from 'react';
import './App.css';
import { ChakraProvider, extendTheme, Box, Text, Badge, Button, Stack, Stat, StatLabel, StatNumber, Input, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const theme = extendTheme({})
/* Title and login/sign up buttons of gamification platform */
const HomePage = () => (
  
  <React.Fragment>
  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    width='100%'
    py={60}
    bgColor={'cyan'}
    bgRepeat='no-repeat'
    borderWidth='thick'
    borderBlockEndColor='turqoise'
    >
    <Text fontSize="6xl" color="indigo">Welcome To Byte Battles</Text>
  </Box>

  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    width='100%'
    py={60}
    bgColor={'cyan'}
    bgRepeat='no-repeat'
    borderWidth='thick'
    borderBlockEndColor='turqoise'
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
  <Text fontSize="xl" color="indigo">About Page</Text>
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
      <Text fontSize="xl" color="indigo" mb={4}>Log In Page</Text>
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
  const location = useLocation();
  const toast = useToast();
  const { user_id } = location.state || {};
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);


const fetchBadgeDetails = async () => {
  try {
    const API_URL = process.env.REACT_APP_API_URL; // URL of the website
    
    const badgeRes = await axios.get(`${API_URL}/api/badge/badge_id`, { params: { id: user_id } }); // Retrieve badge ID from backend
    const pointsRes = await axios.get(`${API_URL}/api/badge/points_needed/${user_id}`); // Retrieve points needed from backend
    
    setBadgeId(badgeRes.data.badge_id); // Sets badge ID
    setPointsNeeded(pointsRes.data.pointsNeeded); // Sets points needed
  } catch (error) {
    console.error('Failed to fetch user badge details:', error);
    toast({ // Handles error
      title: "Error",
      description: "Failed to fetch user badge details.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

useEffect(() => {
  if (user_id) {
    fetchBadgeDetails();
  }
}, [user_id, toast]);



useEffect(() => {
  const updateDetailsIfNeeded = async () => {
    if (pointsNeeded === 0) {
      try {
        const API_URL = process.env.REACT_APP_API_URL; // URL of the website

        await axios.put(`${API_URL}/api/badge/badge_id/${user_id}`); // Updates badge ID from backend
        await axios.put(`${API_URL}/api/badge/points_needed/${user_id}`, { points_to_next_badge: 1000 }); // Updates points needed from backend
        
        await fetchBadgeDetails(); // Refetch after updating
      } catch (error) {
        console.error('Failed to update badge details:', error);
        toast({ // Handles error
          title: "Update Error",
          description: "Failed to update badge details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  updateDetailsIfNeeded();
}, [pointsNeeded, user_id, toast, fetchBadgeDetails]);








  const displayQuestion = async () => {

    try {
      const API_URL = process.env.REACT_APP_API_URL; // URL of the website

      const res = await axios.get(`${API_URL}/api/quiz/questions`, {
        params: { user_id },
      }); //Retrieves random question from backend

      setQuestion(res.data.question); // Sets question
      setSelectedOption(null);
      setFeedbackMsg('');
    } catch (error) {
      console.error(`Retrieval of random question failed: ${error}`);
      toast({ // Handles error
        title: "Error",
        description: "Failed to retrieve the question.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const submitAnswer = async () => {
    if (selectedOption === null) { // Handles case when no answers are selected
      console.log(`No option selected`);
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
      const API_URL = process.env.REACT_APP_API_URL; // URL of the website

      const res = await axios.post(`${API_URL}/api/quiz/questions/quiz/${encodeURIComponent(question.question_name)}/${user_id}`, {
        selected_option: selectedOption,
      }); // If the selected optoin is correct, points needed are reduced by 100 (if no more points then badge is incremented by 1 and points reset to 1000)

      console.log(`Response received from submission: ${res.data}`);
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
        toast({ // Notify user of the correct answer if they were wrong
          title: "Incorrect!",
          description: `Correct answer: ${res.data.correctAnswer}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
  
      setShowNextQuestionButton(true); // Show "Next Question" button
    } catch (error) {
      console.error(`Error submitting answer: ${error}`);
      toast({ // Handles error
        title: "Submission Error",
        description: "There was a problem submitting your answer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (user_id) {
      displayQuestion(); // Display question if user is logged in
    }
  }, [user_id]);


  const fetchNextQuestion = async () => { // Fetches the next question
    displayQuestion(); 
    setShowNextQuestionButton(false); 
    setSelectedOption(null); 
    setFeedbackMsg(''); 

    await fetchBadgeDetails() // Refetches the badge details of the user
  };

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
        py={60}
        bgColor='turquoise'
        bgPosition='center'
        bgRepeat='no-repeat'
        mb={2}
      >
        <Text fontSize="6xl" mb={4} color="indigo">Here is your next question!</Text>
        {question && (
          <>
            <Text fontSize="4xl" color="white" mb={4}>{question.question_content}</Text>
            <VStack spacing={4}>
              {[question.option_one, question.option_two, question.option_three, question.option_four].map((option, index) => (
                <Button
                  key={index}
                  colorScheme={selectedOption === index + 1 ? 'orange' : 'teal'}
                  onClick={() => setSelectedOption(selectedOption === index + 1 ? null : index + 1)}
                >
                  {index + 1}. {option}
                </Button>
              ))}
              
              <Button mt={4} colorScheme='cyan' onClick={submitAnswer} isDisabled={showNextQuestionButton}>
                Submit Answer
              </Button>
              {showNextQuestionButton && (
                <Button mt={4} colorScheme='green' onClick={fetchNextQuestion}>
                  Next Question
                </Button>
              )}
            </VStack>
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
      <ChakraProvider theme={theme}>
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



