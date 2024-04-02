import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Autocomplete, Box, Paper, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';
import CheckableMultiSelect from 'components/Common/MultiSelect';

const columns = [
  {
    id: 'thumbnail',
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: 'brand',
    label: 'Brand',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'unitPrice',
    label: 'Price',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
  {
    id: 'qty',
    label: 'QTY',
  },
  {
    id: 'frameColor',
    label: 'Frame Color',
  },
  {
    id: 'backColor',
    label: 'Back Color',
  },
  {
    id: 'seatColor',
    label: 'Seat Color',
  },
  {
    id: 'backMaterial',
    label: 'Back Material',
  },
  {
    id: 'seatMaterial',
    label: 'Seat Material',
  },
  {
    id: 'withHeadrest',
    label: 'Headrest',
  },
  {
    id: 'withAdArmrest',
    label: 'Adjustable Armrests',
  },
  {
    id: 'remark',
    label: 'Other Remark',
  },
  {
    id: 'shipmentDate',
    label: 'Shipment',
  },
  {
    id: 'arrivalDate',
    label: 'Arrival',
  },
];

const hideColumns = [
  'Frame Color',
  'Back Color',
  'Seat Color',
  'Back Material',
  'Seat Material',
  'Headrest',
  'Adjustable Armrests',
  'Other Remark',
  'Shipment',
  'Arrival'
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const [stocks, setStocks] = useState([]);
  const [features, setFeatures] = useState([]);

  const [filterBrand, setFilterBrand] = useState(null);
  const [filterModel, setFilterModel] = useState(null);

  const [selectedHideColumns, setSelectedHideColumns] = useState([])

  const getFeatures = (cancelToken) => {
    axios
      .get('/chairStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getStocks = (cancelToken) => {
    axios
      .get('/chairStock', { cancelToken })
      .then((response) => {
        // handle success
        setStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const onHideColumnChanged = (values) => {
    setSelectedHideColumns(values)
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    getFeatures(source.token);
    getStocks(source.token);
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
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {[
          {
            label: 'Brand',
            value: filterBrand,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterBrand(value);
              setFilterModel(null);
            },
            options: features
              .map((item) => item.brand)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
          {
            label: 'Model',
            value: filterModel,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterModel(value);
            },
            options: features
              .filter((item) => !filterBrand || item.brand === filterBrand)
              .map((item) => item.model)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
        ].map(({ label, ...props }, index) => (
          <Autocomplete
            key={index}
            sx={{ flexBasis: '200px', maxWidth: '200px' }}
            renderInput={(params) => <TextField {...params} label={label} />}
            {...props}
          />
        ))}
      </Paper>
      <CheckableMultiSelect 
        options={hideColumns}
        onChange={onHideColumnChanged}
        selected={selectedHideColumns} 
      />
      <DataGrid
        nonSelect={true}
        title="Chair Stocks"
        rows={stocks
          .map(
            (
              {
                withHeadrest,
                withAdArmrest,
                thumbnailURL,
                shipmentDate,
                arrivalDate,
                ...restProps
              },
              index
            ) => ({
              thumbnail: (
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    Swal.fire({
                      html: `<img alt="" width="400px" src="${thumbnailURL}" />`,
                      showCloseButton: true,
                      showConfirmButton: false,
                      allowOutsideClick: false,
                    });
                  }}
                >
                  <img
                    alt=""
                    width="80px"
                    src={thumbnailURL}
                    style={{ marginTop: '5px' }}
                  />
                </a>
              ),
              withHeadrest: withHeadrest ? 'Yes' : 'No',
              withAdArmrest: withAdArmrest ? 'Yes' : 'No',
              shipmentDate: (() => {
                if (shipmentDate === null) return 'No';
                const createdTime = new Date(shipmentDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              arrivalDate: (() => {
                if (arrivalDate === null) return 'No';
                const createdTime = new Date(arrivalDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              ...restProps,
            })
          )
          .filter(
            (item) =>
              (!filterBrand || item.brand === filterBrand) &&
              (!filterModel || item.model === filterModel)
          )}
        columns={
          columns.map((column, i) => {
            if (i > 5) {
              if (selectedHideColumns.find(hideColumn=>hideColumn === column.label)) 
                return column
              else 
                return undefined
            }
            return column
          }).filter(column=>column !== undefined)
        }
      />
    </Box>
  );
});

export default Stock;
