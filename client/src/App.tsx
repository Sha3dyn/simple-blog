import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Link,
  Button
} from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Blog from './components/blog';
import Post from './components/post';
import NewPost from './components/newPost';
import EditPost from './components/editPost';
import CssBaseline from '@mui/material/CssBaseline';

const App : React.FC = () : React.ReactElement => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));
  const [user, setUser] = useState<string>(String(localStorage.getItem("username")));

  const logout = () => {
    localStorage.clear();
    setToken("null");
    setUser("null");
    navigate("/");
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Link href="/" variant="h6" underline="none" sx={{ color: "#FFFFFF", flexGrow: 1 }}>
              Blogi
            </Link>
            {user && token && user !== "null" && token !== "null"
              ? <Button color="inherit" onClick={logout}>Kirjaudu ulos</Button>
              : <Button color="inherit" href="/login">Kirjaudu sisään</Button>
            }
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        <Routes>
          <Route path="/" element={<Blog token={token} user={user} />}/>
          <Route path="/:id" element={<Post token={token} user={user} />}/>
          <Route path="/post" element={<NewPost token={token} user={user} />}/>
          <Route path="/post/:id" element={<EditPost token={token} user={user} />}/>
          <Route path="/login" element={<Login setToken={setToken} setUser={setUser} action="login" />}/>
          <Route path="/register" element={<Login setToken={setToken} setUser={setUser} action="register" />}/>
        </Routes>
      </main>
    </>
  );
}

export default App;
