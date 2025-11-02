import styled from "styled-components";

export const AuthContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ToggleButton = styled.button`
  padding: 10px;
  font-size: 14px;
  background-color: transparent;
  color: #4CAF50;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #45a049;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin: 10px 0;
`;
