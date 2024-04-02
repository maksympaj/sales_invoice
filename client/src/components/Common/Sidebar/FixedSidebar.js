import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Collapse,
  Divider,
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
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#6b778c',
      borderRadius: 4,
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

const FixedSidebar = ({ drawerWidth, handleLogout, lists }) => {
  const classes = useFixedSidebarStyles({ drawerWidth });
  const [expList, setExpList] = useState(-1);
  const [expIndex, setExpIndex] = useState(-1);

  return (
    <Box
      className = {classes.root}
      sx = {{
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {lists.map((list, listIndex) => [
        <List key={`list-${listIndex}`}>
          {list.category ? (
            <Typography variant="h6" sx={{ pl: '10px' }}>
              {list.category}
            </Typography>
          ) : null}
          {list.content.map((listitem, itemIndex) =>
            listitem.children ? (
              [
                <ListItem
                  key={`listitem-${itemIndex}`}
                  button
                  className={classes.navlink}
                  onClick={() => {
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
                  key={`listcollapse-${itemIndex}`}
                  in={expIndex === itemIndex && expList === listIndex}
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
                key={`listitem-${itemIndex}`}
                activeClassName="active"
                {...listitem}
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
        <ListItem button className={classes.navlink} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

FixedSidebar.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  handleLogout: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
};

export default FixedSidebar;
