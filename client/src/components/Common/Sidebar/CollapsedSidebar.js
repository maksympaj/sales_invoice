import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const useFixedSidebarStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    paddingTop: '10px',
    width: (props) => props.drawerWidth,
    backgroundColor: '#fff',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    '& a': {
      textDecoration: 'none',
    },
  },
  navlink: {
    color: '#6b778c',
    '&:hover': {
      // backgroundColor: '#5664d20a',
    },
    transition: 'background-color ease .5s',

    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-root': {
      '.active &': {
        color: '#5664d2',
      },
    },
  },
});

const FixedSidebar = ({
  drawerWidth,
  handleLogout,
  handleDrawerClose,
  lists,
  mobileOpen,
}) => {
  const classes = useFixedSidebarStyles({ drawerWidth });
  const [expList, setExpList] = useState(-1);
  const [expIndex, setExpIndex] = useState(-1);

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      PaperProps={{
        className: classes.root,
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
      }}
    >
      {lists.map((list, listIndex) => [
        <List key = {`list-${listIndex}`}>
          { list.category ? (
            <Typography variant="h6" sx={{ pl: '10px' }}>
              {list.category}
            </Typography>
          ) : null }
          { list.content.map((listitem, itemIndex) =>
            listitem.children ? (
              [
                <ListItem
                  key = { `listitem-${itemIndex}` }
                  button
                  className = {classes.navlink}
                  onClick = { () => {
                    if (expIndex === itemIndex && expList === listIndex) {
                      setExpIndex(-1);
                      setExpList(-1);
                    } else {
                      setExpIndex(itemIndex);
                      setExpList(listIndex);
                    }
                  }}
                  secondaryAction={
                    <ExpandMoreIcon
                      sx={{
                        transition: 'transform ease .3s',
                        transform:
                          expIndex === itemIndex && expList === listIndex
                            ? ''
                            : 'Rotate(-90deg)',
                      }}
                    />
                  }
                >
                  <ListItemIcon>{listitem.icon}</ListItemIcon>
                  <ListItemText primary={listitem.label} />
                </ListItem>,
                <Collapse
                  key = { `listcollapse-${itemIndex}` }
                  in = { expIndex === itemIndex && expList === listIndex }
                >
                  <List disablePadding>
                    {listitem.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.path}
                        exact
                        activeClassName="active"
                      >
                        <ListItem button className={classes.navlink}>
                          <ListItemIcon>{null}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItem>
                      </NavLink>
                    ))}
                  </List>
                </Collapse>,
              ]
            ) : (
              <NavLink
                key = {`listitem-${itemIndex}`}
                {...listitem}
                activeClassName = "active"
              >
                <ListItem button className={classes.navlink}>
                  <ListItemIcon>{listitem.icon}</ListItemIcon>
                  <ListItemText primary={listitem.label} />
                </ListItem>
              </NavLink>
            )
          )}
        </List>,
        <Divider key={`listdivider-${listIndex}`} />,
      ])}
      <List>
        <ListItem
          button
          className = {classes.navlink}
          onClick = {(e) => {
            handleDrawerClose(e);
            handleLogout(e);
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary = "Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

FixedSidebar.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
};

export default FixedSidebar;
