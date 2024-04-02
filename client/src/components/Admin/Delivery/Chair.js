import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { Edit as EditIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'proDeliveryDate',
    label: 'Proposed Delivery Date',
    sx: { paddingLeft: '10px', minWidth: 120 },
  },
  { id: 'orderDate', label: 'Order Date', sx: { minWidth: 100 } },
  { id: 'invoiceNum', label: 'Inovice #', sx: { minWidth: 100 } },
  { id: 'poNum', label: 'PO #', sx: { minWidth: 100 } },
  { id: 'district', label: 'Delivery Address' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'brand', label: 'Brand' },
  { id: 'model', label: 'Model' },
  { id: 'frameColor', label: 'FColor' },
  { id: 'backColor', label: 'BColor' },
  { id: 'seatColor', label: 'SColor' },
  { id: 'withHeadrest', label: 'Headrest' },
  { id: 'withAdArmrest', label: 'Armrest' },
  { id: 'remark', label: 'Remark' },
  { id: 'deliveryPDF', label: 'Note', sx: { paddingRight: '10px' } },
  { id: 'edit' },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [deliveries, setDeliveries] = useState([]);
  const [ids, setIDs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formProps, setFormProps] = useState([]);

  const handleEditClick = (index) => {
    if (index < deliveries.length && index >= 0) {
      setIDs([deliveries[index].id]);
      setFormProps([
        {
          name: 'poNum',
          label: 'PO #',
          type: 'text',
          defaultValue: deliveries[index].poNum,
          width: '100%',
        },
      ]);
    }
    setFormOpen(true);
  };

  const handleBulkEditClick = (selected) => {
    setIDs(selected);
    setFormProps([
      {
        name: 'poNum',
        label: 'PO #',
        type: 'text',
        width: '100%',
      },
    ]);
    setFormOpen(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .put(`/delivery/chair`, {
        ids,
        poNum: data.get('poNum'),
      })
      .then((response) => {
        // handle success
        setFormOpen(false);
        getDeliveries();
      })
      .catch(function (error) {
        // handle error
        setFormOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: error.response.data.message.replace('\n', '<br />'),
          allowOutsideClick: false,
        }).then(() => {
          setFormOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeliveries = (props) => {
    axios
      .get('/delivery/allChair', props)
      .then((response) => {
        // handle 
        const deliveries = response.data.filter(item => item.SalesOrder.paid===true)
        setDeliveries(deliveries);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDeliveries({
      cancelToken: source.token,
      // params: {
      //   fromDate: (() => {
      //     const now = new Date();
      //     now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //     now.setDate(now.getDate() - 10);
      //     return now.toISOString().split('T')[0];
      //   })(),
      //   toDate: (() => {
      //     const now = new Date();
      //     now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //     return now.toISOString().split('T')[0];
      //   })(),
      // },
    });
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        padding: '10px 20px',
      }}
    >
      {/* <Paper
        component="form"
        sx={{
          marginTop: '10px',
          padding: '5px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          getDeliveries({
            params: {
              fromDate: data.get('fromDate'),
              toDate: data.get('toDate'),
            },
          });
        }}
      >
        {[
          {
            width: ['100%', '43%'],
            type: 'date',
            name: 'fromDate',
            label: 'From Date',
            defaultValue: (() => {
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              now.setDate(now.getDate() - 10);
              return now.toISOString().split('T')[0];
            })(),
            InputLabelProps: { shrink: true },
          },
          {
            width: ['100%', '43%'],
            type: 'date',
            name: 'toDate',
            label: 'To Date',
            defaultValue: (() => {
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              return now.toISOString().split('T')[0];
            })(),
            InputLabelProps: { shrink: true },
          },
        ].map(({ width, ...restParams }, index) => (
          <TextField
            key={index}
            sx={{ flexBasis: width, minWidth: width }}
            {...restParams}
          />
        ))}
        <Button
          type="submit"
          sx={{ flexBasis: ['100%', '10%'], minWidth: ['100%', '10%'] }}
        >
          OK
        </Button>
      </Paper> */}
      <DataGrid
        title="Chair Delivery"
        rows={deliveries.map(
          ({ id, SalesOrder, ChairStock, ...restProps }, index) => ({
            id,
            orderDate: (() => {
              const createdTime = new Date(SalesOrder.createdAt);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split('T')[0];
            })(),
            invoiceNum: `I-${SalesOrder.Seller.prefix}${new Date(
              SalesOrder.createdAt
            ).getFullYear()}-${('000' + SalesOrder.invoiceNum).substr(-3)}`,
            district: SalesOrder.district,
            name: SalesOrder.name,
            phone: SalesOrder.phone,
            email: SalesOrder.email,
            brand: ChairStock === null ? '' : ChairStock.brand,
            model: ChairStock === null ? '' : ChairStock.model,
            frameColor: ChairStock === null ? '' : ChairStock.frameColor,
            backColor: ChairStock === null ? '' : ChairStock.backColor,
            seatColor: ChairStock === null ? '' : ChairStock.seatColor,
            withHeadrest: ChairStock === null ? 'No' : ChairStock.withHeadrest ? 'Yes' : 'No',
            withAdArmrest: ChairStock === null ? 'No' : ChairStock.withAdArmrest ? 'Yes' : 'No',
            remark: ChairStock === null ? '' : ChairStock.reamrk,
            deliveryPDF: (
              <Button
                variant="contained"
                sx={{ my: '5px', width: 100, fontSize: 10 }}
                component={RouterLink}
                target="_blank"
                to={`/deliveryPDF/chair/${id}`}
              >
                Delivery Note
              </Button>
            ),
            edit: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleEditClick(index);
                }}
              >
                <EditIcon />
              </IconButton>
            ),
            ...restProps,
          })
        )}
        columns={columns}
        onBulkEditClick={handleBulkEditClick}
      />
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={formOpen}
        PaperProps={{
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Edit PO #</DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              mt: '5px',
              p: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {formProps.map(({ width, ...restParams }, index) => (
              <TextField
                key={index}
                sx={{ flexBasis: width, minWidth: width }}
                {...restParams}
              />
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFormOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
