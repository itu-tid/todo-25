import { useState } from "react";
import { signUp, logIn } from "../services/authService";
import {
  AuthContainer,
  Title,
  Form,
  Input,
  Button,
  ToggleButton,
  ErrorMessage
} from "./LoginPage.sc";

export default function LoginPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(username, password, email);
      } else {
        await logIn(username, password);
      }

      // Call the success callback to notify parent component
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <AuthContainer>
      <Title>{isSignUp ? "Sign Up" : "Log In"}</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {isSignUp && (
          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
        </Button>
      </Form>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <ToggleButton type="button" onClick={toggleMode}>
          {isSignUp ? "Log In" : "Sign Up"}
        </ToggleButton>
      </div>
    </AuthContainer>
  );
}
