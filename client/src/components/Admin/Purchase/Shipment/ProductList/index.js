import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  indigo,
  teal,
} from '@mui/material/colors';

export const ProductList = styled(List)(({ theme }) => ({
  backgroundColor: teal[600],
  padding: '10px',
}));

export const ProductListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: teal[300],
  boxShadow: `0px 2px 1px -1px rgb(0 0 0 / 20%)`,
  margin: '10px 0',
  flexWrap: 'wrap',
}));

export const ProductListItemText = styled(ListItemText)(({ theme }) => ({
  color: indigo[900],
}));

export const ProductPriceAmount = ({ unitPrice, amount, deliveryOption }) => {
  return (
    <Box flexBasis="100%" display="flex" flexWrap="wrap" alignItems="center">
      {[amount, deliveryOption].map((item, index) => (
        <Typography
          key={index}
          variant="span"
          sx={{
            color: 'white',
            width: index === 2 ? 150 : 80,
            whiteSpace: 'noWrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            backgroundColor: indigo[400],
            fontSize: ['10px', '12px'],
            padding: '3px 0',
            margin: '3px 10px 3px 0',
            flexShrink: 0,
            borderRadius: '2px',
          }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
};
