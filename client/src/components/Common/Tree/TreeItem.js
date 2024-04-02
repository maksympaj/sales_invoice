import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { TreeItem, treeItemClasses } from '@mui/lab';
import { styled } from '@mui/material/styles';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightRegular,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightBold,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = (props) => {
  const {
    bgColor,
    color,
    labelAction: LabelAction,
    labelIcon: LabelIcon,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Box
            component={LabelIcon}
            color="inherit"
            sx={{ mr: 1, fontSize: 30 }}
          />
          <Typography
            variant="body2"
            fontSize={20}
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          {LabelAction}
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
};

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelAction: PropTypes.element,
  labelIcon: PropTypes.elementType.isRequired,
  labelText: PropTypes.string.isRequired,
};

export default StyledTreeItem;
