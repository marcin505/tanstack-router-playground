import React from 'react';
import styled from 'styled-components';
import { Button as MoviesButton } from '../movies/styles'

export const MovieRecord = styled.div`
  display: flex;
  padding: 0.3rem 0;
`;

export const Button = styled.button`
    background-color: #f2f2f2;
    padding: 4px;
    border: 1px gray solid;
    font-size: 0.9rem;

    &:hover {
      background-color: #d8d8d8;
    }
`

export const MovieContainer = styled.div`
    flex: 1 1 0%;
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    padding-top: 75px;
`;