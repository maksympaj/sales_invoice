import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import {
  BookOnline as BookOnlineIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

import AppHeader from 'components/Common/AppHeader';
import { CollapsedSidebar, FixedSidebar } from 'components/Common/Sidebar';
import { logout } from 'services/auth.service';

import { ChairStock } from './Chair';
import { DeskStock } from './Desk';
import { AccessoryStock } from './Accessory';
import {
  SalesOrderCreate,
  SalesOrderEdit,
  SalesOrderView,
} from './Salement/SalesOrder';
import {
  QuotationCreate,
  QuotationEdit,
  QuotationView,
} from './Salement/Quotation';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const drawerWidth = 240;
const drawerHeight = 50;

const menuLists = [
  {
    category: 'Chair',
    content: [
      { to: '/user/chair/stock', icon: <StorefrontIcon />, label: 'Stock' },
    ],
  },
  {
    category: 'Desk',
    content: [
      { to: '/user/desk/stock', icon: <StorefrontIcon />, label: 'Stock' },
    ],
  },
  {
    category: 'Accessory',
    content: [
      {
        to: '/user/accessory/stock',
        icon: <StorefrontIcon />,
        label: 'Stock',
      },
    ],
  },
  {
    category: 'Sales',
    content: [
      { to: '/user/sales', icon: <BookOnlineIcon />, label: 'Order' },
      { to: '/user/quotation', icon: <BookOnlineIcon />, label: 'Quotation' },
    ],
  },
];

const Standard = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path } = useRouteMatch();

  const handleDrawerOpen = (e) => {
    e.preventDefault();
    setMobileOpen(true);
  };

  const handleDrawerClose = (e) => {
    e.preventDefault();
    setMobileOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Log out will remove your session information permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'No, Keep Login',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        props.logout();
      }
    });
  };

  return (
    <>
      <AppHeader
        drawerHeight={drawerHeight}
        handleDrawerToggle={handleDrawerOpen}
        title="Salesman"
      />
      <Box
        flexBasis={`calc(100% - ${drawerHeight}px)`}
        maxHeight={`calc(100% - ${drawerHeight}px)`}
        position="relative"
        display="flex"
        backgroundColor="#f4f5f7"
      >
        <CollapsedSidebar
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          drawerWidth={drawerWidth}
          handleLogout={handleLogout}
          lists={menuLists}
        />
        <FixedSidebar
          drawerWidth={drawerWidth}
          handleLogout={handleLogout}
          lists={menuLists}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Switch>
            <Route path={`${path}/chair/stock`} component={ChairStock} />
            <Route path={`${path}/desk/stock`} component={DeskStock} />
            <Route path={`${path}/accessory/stock`} component={AccessoryStock} />
            <Route path={`${path}/sales`} exact component={SalesOrderView} />
            <Route path={`${path}/sales/create`} exact component={SalesOrderCreate} />
            <Route path={`${path}/sales/edit`} exact component={SalesOrderEdit} />
            <Route path={`${path}/quotation`} exact component={QuotationView} />
            <Route path={`${path}/quotation/create`} exact component={QuotationCreate} />
            <Route path={`${path}/quotation/edit`} exact component={QuotationEdit} />
          </Switch>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, { logout })(Standard);
