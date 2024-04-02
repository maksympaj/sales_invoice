import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Autocomplete,
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
import CheckableMultiSelect from "components/Common/MultiSelect";

const columns = [
  {
    id: "thumbnail",
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: "brand",
    label: "Brand",
  },
  {
    id: "model",
    label: "Model",
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
    id: "frameColor",
    label: "Frame Color",
  },
  {
    id: "backColor",
    label: "Back Color",
  },
  {
    id: "seatColor",
    label: "Seat Color",
  },
  {
    id: "backMaterial",
    label: "Back Material",
  },
  {
    id: "seatMaterial",
    label: "Seat Material",
  },
  {
    id: "withHeadrest",
    label: "Headrest",
  },
  {
    id: "withAdArmrest",
    label: "Adjustable Armrests",
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

const hideColumns = [
  "Frame Color",
  "Back Color",
  "Seat Color",
  "Back Material",
  "Seat Material",
  "Headrest",
  "Adjustable Armrests",
  "Other Remark",
  "Shipment",
  "Arrival",
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [formMode, setFormMode] = useState("create");

  const [stocks, setStocks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formProps, setFormProps] = useState([]);

  const [id, setID] = useState("");

  const [balance, setBalance] = useState(0);
  const [unitPrice, setUnitPrice] = useState(1000);
  const [shipmentQty, setShipmentQty] = useState(0);

  const [features, setFeatures] = useState([]);

  const [filterBrand, setFilterBrand] = useState(null);
  const [filterModel, setFilterModel] = useState(null);

  const [selectedHideColumns, setSelectedHideColumns] = useState([]);

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setFormProps([
        {
          name: "brand",
          label: "Brand",
          type: "text",
          defaultValue: stocks[index].brand,
          width: "48%",
        },
        {
          name: "model",
          label: "Model",
          type: "text",
          defaultValue: stocks[index].model,
          width: "48%",
        },
        {
          name: "frameColor",
          label: "Frame Color",
          type: "text",
          defaultValue: stocks[index].frameColor,
          width: "30%",
        },
        {
          name: "backColor",
          label: "Back Color",
          type: "text",
          defaultValue: stocks[index].backColor,
          width: "30%",
        },
        {
          name: "seatColor",
          label: "Seat Color",
          type: "text",
          defaultValue: stocks[index].seatColor,
          width: "30%",
        },
        {
          name: "backMaterial",
          label: "Back Material",
          type: "text",
          defaultValue: stocks[index].backMaterial,
          width: "48%",
        },
        {
          name: "seatMaterial",
          label: "Seat Material",
          type: "text",
          defaultValue: stocks[index].seatMaterial,
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
          name: "withHeadrest",
          label: "Headrest",
          type: "checkbox",
          defaultValue: stocks[index].withHeadrest,
          width: "48%",
        },
        {
          name: "withAdArmrest",
          label: "Adjustable Armrest",
          type: "checkbox",
          defaultValue: stocks[index].withAdArmrest,
          width: "48%",
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
        text: "This action will remove current ChairStock permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "No, Keep It.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/chairStock/${stocks[index].id}`)
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
      text: "This action will remove selected ChairStocks permanently.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove!",
      cancelButtonText: "No, Keep Them.",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/chairStock", {
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
        const response = await axios.post(`/chairStock/upload`, uploadData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        thumbnailURL = response.data.url;
      } catch (err) {}
    }
    axios
      .put(`/chairStock/${id}`, {
        brand: data.get("brand"),
        model: data.get("model"),
        frameColor: data.get("frameColor"),
        backColor: data.get("backColor"),
        seatColor: data.get("seatColor"),
        backMaterial: data.get("backMaterial"),
        seatMaterial: data.get("seatMaterial"),
        withHeadrest: Boolean(data.get("withHeadrest")),
        withAdArmrest: Boolean(data.get("withAdArmrest")),
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
        const response = await axios.post(`/chairStock/upload`, uploadData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        thumbnailURL = response.data.url;
      } catch (err) {}
    }
    axios
      .post(`/chairStock/create`, {
        brand: data.get("brand"),
        model: data.get("model"),
        frameColor: data.get("frameColor"),
        backColor: data.get("backColor"),
        seatColor: data.get("seatColor"),
        backMaterial: data.get("backMaterial"),
        seatMaterial: data.get("seatMaterial"),
        withHeadrest: Boolean(data.get("withHeadrest")),
        withAdArmrest: Boolean(data.get("withAdArmrest")),
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
      .get("/chairStock/features", { cancelToken })
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
      .get("/chairStock", { cancelToken })
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
    setSelectedHideColumns(values);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getFeatures(source.token);
    getStocks(source.token);
    return () => source.cancel("Stock Component got unmounted");
  }, []);

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
              name: "brand",
              label: "Brand",
              type: "text",
              width: "48%",
            },
            {
              name: "model",
              label: "Model",
              type: "text",
              width: "48%",
            },
            {
              name: "frameColor",
              label: "Frame Color",
              type: "text",
              width: "30%",
            },
            {
              name: "backColor",
              label: "Back Color",
              type: "text",
              width: "30%",
            },
            {
              name: "seatColor",
              label: "Seat Color",
              type: "text",
              width: "30%",
            },
            {
              name: "backMaterial",
              label: "Back Material",
              type: "text",
              width: "48%",
            },
            {
              name: "seatMaterial",
              label: "Seat Material",
              type: "text",
              width: "48%",
            },
            {
              name: "remark",
              label: "Other Remark",
              type: "text",
              width: "100%",
            },
            {
              name: "withHeadrest",
              label: "Headrest",
              type: "checkbox",
              width: "48%",
            },
            {
              name: "withAdArmrest",
              label: "Adjustable Armrest",
              type: "checkbox",
              width: "48%",
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
      <label htmlFor="contained-button-file">
        <input
          accept=".xlsx"
          id="contained-button-file"
          type="file"
          style={{ display: "none" }}
          onChange={async (e) => {
            e.preventDefault();
            try {
              if (e.target.files.length > 0) {
                const uploadData = new FormData();
                uploadData.append("file", e.target.files[0]);
                await axios.post(
                  `/chairStock/uploadCreate`,
                  uploadData,
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                );
                getStocks();
              }
            } catch (error) {
              console.log(error);
            } finally {
              e.target.value = null;
            }
          }}
        />
        <Button component="span" sx={{ ml: 2 }}>
          Bulk Upload
        </Button>
      </label>
      <Paper
        sx={{
          marginTop: "10px",
          padding: "5px 10px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {[
          {
            label: "Brand",
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
            label: "Model",
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
            sx={{ flexBasis: "200px", maxWidth: "200px" }}
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
                    style={{ marginTop: "5px" }}
                  />
                </a>
              ),
              withHeadrest: withHeadrest ? "Yes" : "No",
              withAdArmrest: withAdArmrest ? "Yes" : "No",
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
          )
          .filter(
            (item) =>
              (!filterBrand || item.brand === filterBrand) &&
              (!filterModel || item.model === filterModel)
          )}
        columns={columns
          .map((column, i) => {
            if (i > 5 && i < 16) {
              if (selectedHideColumns.find((hideColumn) => hideColumn === column.label)              )
                return column;
              else
                return undefined;
            }
            return column
          })
          .filter((column) => column !== undefined)}
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
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === "date") {
                return (
                  <TextField
                    key={index}
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
