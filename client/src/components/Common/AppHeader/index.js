import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AppHeader = ({
  component: Component,
  auth,
  drawerHeight,
  handleDrawerToggle,
  title,
  ...rest
}) => (
  <AppBar
    position="static"
    sx={{
      backgroundColor: '#5664d2',
      flexBasis: `${drawerHeight}px`,
      maxHeight: `${drawerHeight}px`,
    }}
  >
    <Toolbar variant="dense">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

AppHeader.propTypes = {
  auth: PropTypes.object.isRequired,
  drawerHeight: PropTypes.number.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AppHeader);
