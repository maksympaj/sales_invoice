import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const GuestRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isLoggedIn === false ? (
        <Component {...props} />
      ) : auth.isAdmin === true ? (
        <Redirect to="/admin/sales" />
      ) : (
        <Redirect to="/user/sales" />
      )
    }
  />
);

GuestRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(GuestRoute);
