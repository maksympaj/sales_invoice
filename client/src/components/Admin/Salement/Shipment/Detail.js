import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Input,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [ponumber, setPONumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [stocksIndex, setStocksIndex] = useState(0);
  const [chairs, setChairs] = useState([]);
  const [desks, setDesks] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [chairQtys, setChairQtys] = useState([]);
  const [deskQtys, setDeskQtys] = useState([]);
  const [accessoryQtys, setAccessoryQtys] = useState([]);

  const getProductsPending = (cancelToken) => {
    axios
      .get("/shipment/products", { cancelToken })
      .then((response) => {
        // handle success
        console.log(response.data);

        const chairs = response.data.chairs;
        setChairs(chairs);
        const chairQtys = chairs.map((chair) => parseInt(chair.totalQty));
        setChairQtys(chairQtys);

        const desks = response.data.desks;
        setDesks(desks);
        const deskQtys = desks.map((desk) => parseInt(desk.totalQty));
        setDeskQtys(deskQtys);

        const accessories = response.data.accessories;
        setAccessories(accessories);
        const accessoryQtys = accessories.map((accessory) =>
          parseInt(accessory.totalQty)
        );
        setAccessoryQtys(accessoryQtys);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getProductsPending(source.token);
    return () => source.cancel("Stock Component got unmounted");
  }, []);

  const onChairQtyChanged = (e, index) => {
    const qty = e.target.value;
    const newQtys = chairQtys.map((chairQty, i) => {
      if (index === i) {
        const orderedQty = parseInt(chairs[index].orderedQty);
        return qty > orderedQty ? qty : orderedQty;
      } else return chairQty;
    });
    setChairQtys(newQtys);
  };

  const onDeskQtyChanged = (e, index) => {
    const qty = e.target.value;
    const newQtys = deskQtys.map((deskQty, i) => {
      if (index === i) {
        const orderedQty = parseInt(desks[index].orderedQty);
        return qty > orderedQty ? qty : orderedQty;
      } else return deskQty;
    });
    setDeskQtys(newQtys);
  };

  const onAccessoryQtyChanged = (e, index) => {
    const qty = e.target.value;
    const newQtys = accessoryQtys.map((accessoryQty, i) => {
      if (index === i) {
        const orderedQty = parseInt(accessories[index].orderedQty);
        return qty > orderedQty ? qty : orderedQty;
      } else return accessoryQty;
    });
    setAccessoryQtys(newQtys);
  };

  const onShipmentSave = () => {
    const chairProducts = chairs.map((chair, index) => {
      const qty = chairQtys.find((chairQty, i) => index === i);
      return { ...chair, totalQty: qty };
    });

    const deskProducts = desks.map((desk, index) => {
      const qty = deskQtys.find((deskQty, i) => index === i);
      return { ...desk, totalQty: qty };
    });

    const accessoryProducts = accessories.map((accessory, index) => {
      const qty = accessoryQtys.find((accessoryQty, i) => index === i);
      return { ...accessory, totalQty: qty };
    });

    const arrivalDates = arrivalDate.split("-");
    const arrival_date = arrivalDates[0] !== "0000" ? arrivalDate : "";

    axios
      .post(`/shipment/create`, {
        ponumber,
        orderDate,
        arrivalDate: arrival_date,
        chairs: chairProducts,
        desks: deskProducts,
        accessories: accessoryProducts,
      })
      .then(() => {
        // handle success
        props.history.push("/admin/shipment");
      })
      .catch(function (error) {
        // handle error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {});
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "20px 10px 10px 20px",
      }}
    >
      <Box
        sx={{ mx: "auto", mt: "20px" }}
        component="form"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          onShipmentSave();
        }}
      >
        <Paper>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flexBasis: "100%",
                minWidth: "100%",
                paddingLeft: 2,
                paddingTop: 1,
              }}
            >
              New Shipment
            </Typography>
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
                width: "30%",
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
                width: "30%",
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
                width: "30%",
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
                  {chairs.map((chair, index) => {
                    const clientsArr = chair.clients.split(",");
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
                        <TableCell>{chair.orderedQty}</TableCell>
                        <TableCell align="right">
                          <Input
                            type="number"
                            value={chairQtys[index] ?? 0}
                            onChange={(e) => onChairQtyChanged(e, index)}
                          />
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
                    <TableCell>Oredered Qty</TableCell>
                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {desks.map((desk, index) => {
                    const clientsArr = desk.clients.split(",");
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
                          {desk.model}
                        </TableCell>
                        <TableCell>{uniqueClients.join(", ")}</TableCell>
                        <TableCell>{desk.hasDeskTop}</TableCell>
                        <TableCell>{desk.topMaterial}</TableCell>
                        <TableCell>{desk.topColor}</TableCell>
                        <TableCell>{desk.orderedQty}</TableCell>
                        <TableCell align="right" width={100}>
                          <Input
                            type="number"
                            value={deskQtys[index] ?? 0}
                            onChange={(e) => onDeskQtyChanged(e, index)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                  {accessories.map((accessory, index) => {
                    const clientsArr = accessory.clients.split(",");
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
                        <TableCell>{accessory.orderedQty}</TableCell>
                        <TableCell align="right">
                          <Input
                            type="number"
                            value={accessoryQtys[index] ?? 0}
                            onChange={(e) => onAccessoryQtyChanged(e, index)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
        <Button
          type="submit"
          variant="contained"
          sx={{
            maxHeight: "40px",
            marginTop: "7px",
            float: "right",
            marginLeft: "10px",
          }}
        >
          Create
        </Button>
        <Button
          type="button"
          sx={{ maxHeight: "40px", marginTop: "7px", float: "right" }}
          onClick={() => {
            setPONumber("");
            setOrderDate("");
            setArrivalDate("");
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
});
