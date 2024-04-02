import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
    id: "remark",
    label: "Other Remark",
  },
  {
    id: "shipmentDate",
    label: "Shipment",
  },
  {
    id: "arrivalDate",
    label: "Arrival",
  },
  {
    id: "edit",
    nonSort: true,
  },
  {
    id: "delete",
    nonSort: true,
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [formMode, setFormMode] = useState("create");

  const [stocks, setStocks] = useState([]);
  const [initStocks, setInitStocks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formProps, setFormProps] = useState([]);

  const [id, setID] = useState("");

  const [balance, setBalance] = useState(0);
  const [unitPrice, setUnitPrice] = useState(1000);
  const [shipmentQty, setShipmentQty] = useState(0);

  // const [features, setFeatures] = useState([]);

  const [filterCategory, setFilterCategory] = useState("All");

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setFormProps([
        {
          name: "name",
          label: "Name",
          type: "text",
          defaultValue: stocks[index].name,
          width: "48%",
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          defaultValue: stocks[index].category,
          width: "48%",
        },
        {
          name: "remark",
          label: "Other Remark",
          multiline: true,
          type: "text",
          defaultValue: stocks[index].remark,
          width: "100%",
        },
        {
          name: "shipmentDate",
          label: "Shipment Date",
          type: "date",
          defaultValue: stocks[index].shipmentDate,
          width: "48%",
        },
        {
          name: "arrivalDate",
          label: "Arrival Date",
          type: "date",
          defaultValue: stocks[index].arrivalDate,
          width: "48%",
        },
      ]);
      setBalance(stocks[index].balance);
      setUnitPrice(stocks[index].unitPrice);
      setShipmentQty(stocks[index].qty - stocks[index].balance);
    }
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleRemoveClick = (index) => {
    if (index < stocks.length && index >= 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will remove current AccessoryStock permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "No, Keep It.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/accessoryStock/${stocks[index].id}`)
            .then((response) => {
              // handle success
              getStocks();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message,
                allowOutsideClick: false,
              });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const handleBulkRemoveClick = (selected) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will remove selected AccessoryStocks permanently.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove!",
      cancelButtonText: "No, Keep Them.",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/accessoryStock", {
            data: { ids: selected },
          })
          .then((response) => {
            // handle success
            getStocks();
          })
          .catch(function (error) {
            // handle error
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data.message,
              allowOutsideClick: false,
            });
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      }
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let thumbnailURL = "";
    if (data.get("thumbnail").name) {
      const uploadData = new FormData();
      uploadData.append("file", data.get("thumbnail"));
      try {
        const response = await axios.post(
          `/accessoryStock/upload`,
          uploadData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        thumbnailURL = response.data.url;
      } catch (err) {}
    }
    axios
      .put(`/accessoryStock/${id}`, {
        name: data.get("name"),
        category: data.get("category"),
        remark: data.get("remark"),
        thumbnailURL,
        unitPrice: data.get("unitPrice"),
        shipmentDate: data.get("shipmentDate") || null,
        arrivalDate: data.get("arrivalDate") || null,
        balance: balance,
        qty: Number(balance) + Number(shipmentQty),
      })
      .then((response) => {
        // handle success
        setFormOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setFormOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          html: error.response.data.message.replace("\n", "<br />"),
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

  const handleCreate = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let thumbnailURL = "";
    if (data.get("thumbnail").name) {
      const uploadData = new FormData();
      uploadData.append("file", data.get("thumbnail"));
      try {
        const response = await axios.post(
          `/accessoryStock/upload`,
          uploadData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        thumbnailURL = response.data.url;
      } catch (err) {}
    }
    axios
      .post(`/accessoryStock/create`, {
        name: data.get("name"),
        category: data.get("category"),
        remark: data.get("remark"),
        thumbnailURL,
        unitPrice: data.get("unitPrice"),
        shipmentDate: data.get("shipmentDate") || null,
        arrivalDate: data.get("arrivalDate") || null,
        balance: balance,
        qty: Number(balance) + Number(shipmentQty),
      })
      .then((response) => {
        // handle success
        setFormOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setFormOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
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

  const getFeatures = (cancelToken) => {
    axios
      .get("/accessoryStock/features", { cancelToken })
      .then((response) => {
        // handle success
        // setFeatures(response.data);
        console.log("Feature commented");
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
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          setFormProps([
            {
              name: "name",
              label: "Name",
              type: "text",
              width: "48%",
            },
            {
              name: "category",
              label: "Category",
              type: "select",
              width: "48%",
            },
            {
              name: "remark",
              label: "Remark",
              type: "text",
              width: "100%",
            },
            {
              name: "shipmentDate",
              label: "Shipment Date",
              type: "date",
              width: "48%",
            },
            {
              name: "arrivalDate",
              label: "Arrival Date",
              type: "date",
              width: "48%",
            },
          ]);
          setBalance(0);
          setUnitPrice(1000);
          setShipmentQty(0);
          setFormMode("create");
          setFormOpen(true);
        }}
      >
        New Stock
      </Button>
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
            delete: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleRemoveClick(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
            shipmentDate: shipmentDate || "No",
            arrivalDate: arrivalDate || "No",
            ...restProps,
          })
        )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      />
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        maxWidth="sm"
        open={formOpen}
        PaperProps={{
          component: "form",
          onSubmit: formMode === "create" ? handleCreate : handleSave,
        }}
      >
        <DialogTitle>
          {formMode === "create" ? "New Stock" : "Edit Stock"}
        </DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              mt: "5px",
              p: "10px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {formProps.map(({ type, width, ...restParams }, index) => {
              if (type === "text") {
                return (
                  <TextField
                    key={index}
                    size="small"
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === "date") {
                return (
                  <TextField
                    key={index}
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === "checkbox") {
                const { defaultValue, label, name } = restParams;
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox name={name} defaultChecked={defaultValue} />
                    }
                    label={label}
                  />
                );
              } else if (type === "select") {
                return (
                  <FormControl
                    key={index}
                    size="small"
                    sx={{ flexBasis: width, minWidth: width }}
                  >
                    <InputLabel id="category_select">Category</InputLabel>
                    <Select labelId="category_select" {...restParams}>
                      <MenuItem value="Desk Accessories">
                        Desk Accessories
                      </MenuItem>
                      <MenuItem value="Chair Accessories">
                        Chair Accessories
                      </MenuItem>
                      <MenuItem value="Desk on Desk">Desk on Desk</MenuItem>
                      <MenuItem value="Monitor Arms">Monitor Arms</MenuItem>
                      <MenuItem value="Cabinet">Cabinet</MenuItem>
                      <MenuItem value="Drawer">Drawer</MenuItem>
                    </Select>
                  </FormControl>
                );
              } else return null;
            })}
            <TextField
              label="Thumbnail"
              name="thumbnail"
              type="file"
              sx={{ flexBasis: ["100%", "48%"], minWidth: ["100%", "48%"] }}
              inputProps={{
                accept: "image/png, image/gif, image/jpeg",
              }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              sx={{
                flexBasis: ["100%", "48%"],
                minWidth: ["100%", "48%"],
                alignItems: "baseline",
                m: 0,
              }}
              control={
                <TextField
                  label="Unit Price"
                  type="number"
                  name="unitPrice"
                  defaultValue={unitPrice}
                  fullWidth
                  sx={{ m: "10px 5px 0 0" }}
                />
              }
              label="HKD"
            />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: ["100%", "48%"], minWidth: ["100%", "48%"] }}
            >
              <IconButton
                onClick={() => {
                  setBalance(balance > 1 ? balance - 1 : 0);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                label="Balance"
                value={balance}
                type="number"
                sx={{ width: "80px", mx: "5px" }}
                onChange={(e) => {
                  if (e.target.value > 0) setBalance(e.target.value);
                  else setBalance(0);
                  setUnitPrice(1000);
                }}
              />
              <IconButton
                onClick={() => {
                  setBalance(balance + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: ["100%", "48%"], minWidth: ["100%", "48%"] }}
            >
              <IconButton
                onClick={() => {
                  setShipmentQty(Math.max(shipmentQty - 1, 0));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                label="Shipment"
                value={shipmentQty}
                type="number"
                sx={{ width: "80px", mx: "5px" }}
                onChange={(e) => {
                  setShipmentQty(Math.max(e.target.value, 0));
                }}
              />
              <IconButton
                onClick={() => {
                  setShipmentQty(shipmentQty + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
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
          <Button type="submit">
            {formMode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Stock;
