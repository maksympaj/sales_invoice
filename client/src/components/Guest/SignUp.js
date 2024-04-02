import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from 'sweetalert2';
import LogoTitile from 'images/logo_title.png';

import axios from 'axios';

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

export default connect(mapStateToProps)((props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    axios
      .post('user/register', {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
        prefix: data.get('prefix'),
        type: data.get('type'),
      })
      .then(() => {
        // handle success
        props.history.push('/signin');
        Swal.fire({
          icon: 'success',
          title: 'SignUp Success',
          html: `Your account was successfully registered.<br>You can use your account once Adminstrator allows.`,
          allowOutsideClick: false,
        });
      })
      .catch((err) => {
        // handle error
        Swal.fire({
          icon: 'error',
          title: 'SignUp Failure',
          html: err.response.data.message.replace('\n', '<br />'),
          allowOutsideClick: false,
        });
      })
      .then(function () {
        // always executed
      });
  };

  return (
    <>
      <Box
        sx={{
          mx: 2,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={LogoTitile} style={{ maxWidth: '100%' }} alt="Ergoseating" />
        <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          maxWidth="sm"
          width="100%"
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                type="text"
                name="firstName"
                autoComplete="fname"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                type="text"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="prefix"
                label="Prefix"
                type="text"
                autoComplete="prefix"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="user-type-select-label" size="small">
                  Type
                </InputLabel>
                <Select
                  labelId="user-type-select-label"
                  id="user-type-select"
                  defaultValue=""
                  name="type"
                  label="Type"
                >
                  <MenuItem value="salesman">Salesman</MenuItem>
                  <MenuItem value="driver">Driver</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/signin" variant="body2">
                {'Already have an account? Sign In'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  );
});
