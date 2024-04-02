import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from 'sweetalert2';
import LogoTitile from 'images/logo_title.png';

import { login } from 'services/auth.service';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://blueoceanblue.com/">
        Blueoceanblue.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default connect(mapStateToProps, { login })((props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    props
      .login({
        email: data.get('email'),
        password: data.get('password'),
      })
      .then()
      .catch((err) => {
        form.password.value = '';
        Swal.fire({
          icon: 'error',
          title: 'Login Failure',
          html: err.response.data.message.replace('\n', '<br />'),
          allowOutsideClick: false,
        });
      });
  };

  return (
    <>
      <Box
        sx = {{
          mx: 2,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src = {LogoTitile} style={{ maxWidth: '100%' }} alt="Ergoseating" />
        <Avatar sx = {{ m: 2, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          maxWidth = "sm"
          width = "100%"
          component = "form"
          onSubmit = {handleSubmit}
          noValidate
          sx = {{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type = "submit"
            fullWidth
            variant="contained"
            sx = {{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  );
});
