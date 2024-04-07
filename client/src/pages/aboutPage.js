import React from 'react';
import './App.css';
import { ChakraProvider, extendTheme, Box, Text, List, ListItem, Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import client_supabase from './supabaseClient-client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const AboutPage = () => (
    <Text fontSize="xl" color="indigo">About Page</Text>
  );