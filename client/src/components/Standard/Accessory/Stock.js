import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Box,
  Paper,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

import DataGrid from "components/Common/DataGrid";

const columns = [
  {
    id: "thumbnail",
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "remark",
    label: "Other Remark",
  },
  {
    id: "unitPrice",
    label: "Price",
  },
  {
    id: "balance",
    label: "Balance",
  },
  {
    id: "qty",
    label: "QTY",
  },
  {
    id: "shipmentDate",
    label: "Shipment",
  },
  {
    id: "arrivalDate",
    label: "Arrival",
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const [stocks, setStocks] = useState([]);
  const [initStocks, setInitStocks] = useState([]);
  // const [features, setFeatures] = useState([]);

  const [filterCategory, setFilterCategory] = useState("All");

  const getFeatures = (cancelToken) => {
    axios
      .get("/accessoryStock/features", { cancelToken })
      .then((response) => {
        // handle success
        // setFeatures(response.data);
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
      .get("/accessoryStock", { cancelToken })
      .then((response) => {
        // handle success
        setStocks(response.data);
        setInitStocks(response.data);
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
    getFeatures(source.token);
    getStocks(source.token);
    return () => source.cancel("Stock Component got unmounted");
  }, []);

  const handleFilterCategory = (e) => {
    var selected_category = e.target.value;
    setFilterCategory(selected_category);
    if (selected_category === "All") {
      setStocks(initStocks);
    } else {
      setStocks(
        initStocks.filter((stock) => stock.category === selected_category)
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "10px 20px",
      }}
    >
      <Paper
        sx={{
          marginTop: "10px",
          padding: "5px 10px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <FormControl
          size="small"
          sx={{ flexBasis: "200px", maxWidth: "200px" }}
        >
          <InputLabel id="category_filter">Category</InputLabel>
          <Select
            labelId="category_filter"
            label="Category"
            value={filterCategory}
            onChange={handleFilterCategory}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Desk Accessories">Desk Accessories</MenuItem>
            <MenuItem value="Chair Accessories">Chair Accessories</MenuItem>
            <MenuItem value="Desk on Desk">Desk on Desk</MenuItem>
            <MenuItem value="Monitor Arms">Monitor Arms</MenuItem>
            <MenuItem value="Cabinet">Cabinet</MenuItem>
            <MenuItem value="Drawer">Drawer</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      <DataGrid
        nonSelect={true}
        title="Accessory Stocks"
        rows={stocks.map(
          (
            { thumbnailURL, shipmentDate, arrivalDate, ...restProps },
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
                  style={{ marginTop: "5px" }}
                />
              </a>
            ),
            shipmentDate: (() => {
              if (shipmentDate === null) return "No";
              const createdTime = new Date(shipmentDate);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split("T")[0];
            })(),
            arrivalDate: (() => {
              if (arrivalDate === null) return "No";
              const createdTime = new Date(arrivalDate);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split("T")[0];
            })(),
            ...restProps,
          })
        )}
        columns={columns}
      />
    </Box>
  );
});

export default Stock;
