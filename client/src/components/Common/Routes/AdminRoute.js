import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AdminRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isLoggedIn === true ? (
        auth.isAdmin === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/user/sales" />
        )
      ) : (
        <Redirect to="/signin" />
      )
    }
  />
);

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminRoute);
