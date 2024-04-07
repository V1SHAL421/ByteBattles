import React from 'react';
import './App.css';
import { ChakraProvider, extendTheme, Box, Text, List, ListItem, Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import client_supabase from './supabaseClient-client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const HomePage = () => (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width='100%'
      py={60}
      bgColor={'cyan'}
      bgPosition='center'
      bgRepeat='no-repeat'
      mb={2}
    >
      <Text fontSize="6xl" mb={4} color="indigo">Welcome To Byte Battles</Text>
    </Box>
  );