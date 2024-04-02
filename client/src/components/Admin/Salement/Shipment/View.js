import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Swal from "sweetalert2";

import DataGrid from "components/Common/DataGrid";

const columns = [
  {
    id: "ponumber",
    label: "Po Number",
    sx: { paddingLeft: 10 },
  },
  {
    id: "orderDate",
    label: "Order Date",
  },
  {
    id: "arrivalDate",
    label: "Arrival Date",
  },
  {
    id: "showItem",
    nonSort: true,
    label: "Show",
    sx: { maxWidth: 100, width: 100, paddingLeft: 0 },
  },
  {
    id: "edit",
    nonSort: true,
    label: "Edit",
    sx: { maxWidth: 100, width: 100 },
  },
  {
    nonSort: true,
    id: "delete",
    label: "Delete",
    sx: { maxWidth: 100, width: 100 },
  },
];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: "0 10px 10px 10px" }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [shipments, setShipments] = useState([]);
  const [initShipments, setInitShipments] = useState([]);

  const [showOpen, setShowOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [stocksIndex, setStocksIndex] = useState(0);
  const [shipmentIndex, setShipmentIndex] = useState(0);

  const [ponumber, setPONumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const [filterAnchor, setFilterAnchor] = useState(null);

  const [searchPONumber, setSearchPONumber] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleRemoveClick = (index) => {
    if (index < shipments.length && index >= 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will remove current Shipment permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "No, Keep It.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/shipment/${shipments[index].id}`)
            .then((response) => {
              // handle success
              getShipments();
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
            });
        }
      });
    }
  };

  const handleUpdateClick = () => {
    const arrivalDates = arrivalDate.split("-");
    const arrival_date = arrivalDates[0] !== "0000" ? arrivalDate : "";

    if (shipmentIndex < shipments.length && shipmentIndex >= 0) {
      axios
        .put(`/shipment/${shipments[shipmentIndex].id}`, {
          ponumber,
          orderDate,
          arrivalDate: arrival_date,
        })
        .then((response) => {
          setDetailOpen(false);
          getShipments();
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
        });
    }
  };

  const getShipments = (cancelToken) => {
    axios
      .get("/shipment", { cancelToken })
      .then((response) => {
        // handle success
        console.log(response.data);
        setShipments(response.data);
        setInitShipments(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const onKeyPressed = (e) => {
    if (e.key === "Enter") {
      const searchedShipments = initShipments.filter((shipment) =>
        shipment.ponumber.toLowerCase().includes(searchPONumber.toLowerCase())
      );
      // .filter((order) => order.phone.includes(searchPhoneNumber));
      setShipments(searchedShipments);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getShipments(source.token);
    return () => source.cancel("Brand Component got unmounted");
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
        component={RouterLink}
        to="/admin/shipment/create"
        startIcon={<AddIcon />}
      >
        New Shipment
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
        <TextField
          label="PO Number"
          variant="outlined"
          onKeyPress={onKeyPressed}
          value={searchPONumber}
          onChange={(e) => setSearchPONumber(e.target.value)}
        />
      </Paper>
      <DataGrid
        title="Shipments"
        rows={shipments.map(({ id, arrivalDate, ...restProps }, index) => ({
          id,
          index,
          showItem: (
            <IconButton
              onClick={(event) => {
                event.preventDefault();
                setShowOpen(true);
                setShipmentIndex(index);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          ),
          edit:
            arrivalDate.split("-")[0] === "0000" ? (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setDetailOpen(true);
                  setShipmentIndex(index);
                  setPONumber(shipments[index].ponumber);
                  setOrderDate(shipments[index].orderDate);
                  setArrivalDate(shipments[index].arrivalDate);
                }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              ""
            ),
          delete:
            arrivalDate.split("-")[0] === "0000" ? (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleRemoveClick(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              ""
            ),
          arrivalDate: arrivalDate.split("-")[0] === "0000" ? "" : arrivalDate,
          ...restProps,
        }))}
        columns={columns}
        onRemoveClick={handleRemoveClick}
        onFilterClick={handleFilterClick}
      />
      <Dialog
        maxWidth="md"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("md"))}
        open={showOpen}
      >
        <DialogTitle>Products Details</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={stocksIndex}
              onChange={(event, value) => {
                event.preventDefault();
                setStocksIndex(value);
              }}
              aria-label="basic tabs example"
            >
              <Tab label="Chairs" />
              <Tab label="Desks" />
              <Tab label="Accessories" />
            </Tabs>
          </Box>
          <TabPanel value={stocksIndex} index={0}>
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: "100%",
                minWidth: "100%",
                marginTop: "10px",
                maxHeight: 350,
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Clients' name</TableCell>
                    <TableCell>Ordered Qty</TableCell>
                    <TableCell align="right" width={100}>
                      Qty
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipments[shipmentIndex]?.ChairStocks.map((chair, index) => {
                    const clientsArr = chair.ChairToShipment.client.split(",");
                    const uniqueClients = clientsArr.filter((c, i) => {
                      return clientsArr.indexOf(c) === i;
                    });
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {chair.model}
                        </TableCell>
                        <TableCell>{uniqueClients.join(", ")}</TableCell>
                        <TableCell>
                          {chair.ChairToShipment.orderedQty}
                        </TableCell>
                        <TableCell align="right">
                          {chair.ChairToShipment.qty}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={stocksIndex} index={1}>
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: "100%",
                minWidth: "100%",
                marginTop: "10px",
                maxHeight: 350,
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Clients' name</TableCell>
                    <TableCell>HasDeskTop</TableCell>
                    <TableCell>Top Material</TableCell>
                    <TableCell>Top Color</TableCell>
                    <TableCell>Ordered Qty</TableCell>
                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipments[shipmentIndex]?.DeskToShipments.map(
                    (shipment, index) => {
                      const deskStock = shipments[
                        shipmentIndex
                      ].DeskStocks.find(
                        (deskStock) => deskStock.id === shipment.stockId
                      );
                      const clientsArr = shipment.client.split(",");
                      const uniqueClients = clientsArr.filter((c, i) => {
                        return clientsArr.indexOf(c) === i;
                      });
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {deskStock.model}
                          </TableCell>
                          <TableCell>{uniqueClients.join(", ")}</TableCell>
                          <TableCell>
                            {shipment.hasDeskTop ? "yes" : "no"}
                          </TableCell>
                          <TableCell>{shipment.topMaterial}</TableCell>
                          <TableCell>{shipment.topColor}</TableCell>
                          <TableCell>{shipment.orderedQty}</TableCell>
                          <TableCell align="right" width={100}>
                            {shipment.qty}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={stocksIndex} index={2}>
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: "100%",
                minWidth: "100%",
                marginTop: "10px",
                maxHeight: 350,
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Clients' name</TableCell>
                    <TableCell>Ordered Qty</TableCell>
                    <TableCell align="right" width={100}>
                      Qty
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipments[shipmentIndex]?.AccessoryStocks.map(
                    (accessory, index) => {
                      const clientsArr =
                        accessory.AccessoryToShipment.client.split(",");
                      const uniqueClients = clientsArr.filter((c, i) => {
                        return clientsArr.indexOf(c) === i;
                      });
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {accessory.name}
                          </TableCell>
                          <TableCell>{uniqueClients.join(", ")}</TableCell>
                          <TableCell>
                            {accessory.AccessoryToShipment.orderedQty}
                          </TableCell>
                          <TableCell align="right">
                            {accessory.AccessoryToShipment.qty}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setShowOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("xs"))}
        maxWidth="xs"
        open={detailOpen}
      >
        <DialogTitle>Edit Shipment</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {[
              {
                name: "ponumber",
                label: "PO Number",
                type: "text",
                value: ponumber,
                onChange: (e) => {
                  e.preventDefault();
                  setPONumber(e.target.value);
                },
                width: "100%",
                required: true,
              },
              {
                name: "orderDate",
                label: "Order Date",
                type: "date",
                value: orderDate,
                onChange: (e) => {
                  e.preventDefault();
                  setOrderDate(e.target.value);
                },
                width: "100%",
                required: true,
              },
              {
                name: "arrivalDate",
                label: "Arrival Date",
                type: "date",
                value: arrivalDate,
                onChange: (e) => {
                  e.preventDefault();
                  setArrivalDate(e.target.value);
                },
                width: "100%",
              },
            ].map(({ type, width, ...restProps }, index) => {
              if (type === "text") {
                return (
                  <TextField
                    key={index}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restProps}
                  />
                );
              } else if (type === "date") {
                return (
                  <TextField
                    key={index}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restProps}
                  />
                );
              } else return null;
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setDetailOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              handleUpdateClick();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
