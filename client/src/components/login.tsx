import React, { SetStateAction, useRef, Dispatch } from 'react';
import {
    Button,
    TextField,
    Container,
    Box,
    Typography,
    Avatar,
    Stack,
} from '@mui/material';
import {
  LockOutlined,
} from '@mui/icons-material';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface Props {
  setToken : Dispatch<SetStateAction<string>>
  setUser : Dispatch<SetStateAction<string>>
  action : string
}

const LoginForm : React.FC<Props> = (props : Props) : React.ReactElement => {
  const { setToken, setUser, action } = props;
  const formRef = useRef<HTMLFormElement>();
  const navigate : NavigateFunction = useNavigate();

  const login = async (e : React.FormEvent) : Promise<void> => {
    e.preventDefault();

    if(formRef.current?.username.value && formRef.current?.password.value) {
      const conn = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formRef.current?.username.value,
          password: formRef.current?.password.value
        })
      });

      if(conn.status === 200) {
        let response = await conn.json();
        setToken(response.token);
        setUser(response.username);

        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);

        navigate("/");
      }
    } 
  };

  return (
        <Container maxWidth="sm">
          <Box component="form" onSubmit={login} ref={formRef}>
            <Stack spacing={2}>
              <Box
                sx={{
                  marginTop: 8,
                  marginBottom: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LockOutlined />
                </Avatar>
                <Typography component="h4" variant="h5">
                  {action==="login" ? "Kirjaudu sisään" : "Rekisteröidy"}
                </Typography>
              </Box>
              <TextField
                autoFocus
                id="username"
                name="username"
                label="Käyttäjänimi"
                fullWidth
                variant="outlined"
              />
              <TextField
                id="password"
                name="password"
                label="Salasana"
                type="password"
                fullWidth
                variant="outlined"
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Button href="/">Peruuta</Button>
                <Box>
                  <Button href="/register">Rekisteröidy</Button>
                  <Button variant="contained" type="submit">{action==="login" ? "Kirjaudu" : "Rekisteröidy"}</Button>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Container>
  );
}

export default LoginForm;