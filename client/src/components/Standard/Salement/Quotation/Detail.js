import React, { useEffect, useRef, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  Stepper,
  StepLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiPhoneNumber from "material-ui-phone-number";
import axios from "axios";
import Swal from "sweetalert2";

import DataGrid from "components/Common/DataGrid";
import {
  ProductList,
  ProductListItem,
  ProductListItemText,
  ProductPriceAmount,
} from "../ProductList";
import { v4 as uuidv4 } from "uuid";
import CheckableMultiSelect from "components/Common/MultiSelect";

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

const chairColumns = [
  {
    id: "add",
  },
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
];

const hideChairColumns = [
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

const deskColumns = [
  {
    id: "add",
  },
  {
    id: "thumbnail",
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: "supplierCode",
    label: "Supplier",
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
    id: "color",
    label: "Color",
  },
  {
    id: "armSize",
    label: "Arm Size",
  },
  {
    id: "feetSize",
    label: "Feet Size",
  },
  {
    id: "beamSize",
    label: "Beam Size",
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
];

const hideDeskColumns = [
  "Color",
  "Arm Size",
  "Feet Size",
  "Beam Size",
  "Other Remark",
  "Shipment",
  "Arrival",
];

const accessoryColumns = [
  {
    id: "add",
  },
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

const materialOptions = [
  "Melamine",
  "Laminate",
  "North American Walnut",
  "South American Walnut",
  "Red Oak",
  "Maple",
  "Bamboo",
  "Melamine with glass top",
  "Toppal Plyedge",
];

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();
  const { componentType, initialClient, initialCart, initialServices } = props;

  const [topHoleCount, setTopHoleCount] = useState(0);
  const [topHolePosition, setTopHolePosition] = useState("Left");
  const [topHoleType, setTopHoleType] = useState("Rounded");
  const [topMaterial, setTopMaterial] = useState("Melamine");
  const [topColor, setTopColor] = useState("");
  const [topLength, setTopLength] = useState(700);
  const [topWidth, setTopWidth] = useState(400);
  const [topThickness, setTopThickness] = useState(25);
  const [topRoundedCorners, setTopRoundedCorners] = useState(0);
  const [topCornerRadius, setTopCornerRadius] = useState(50);
  const [sketchUrl, setSketchUrl] = useState("");

  const steps = [
    "Input Client Info",
    "Select Products",
    "Input Payment Details",
  ];
  const clientForm = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [deskAddOpen, setDeskAddOpen] = useState(false);
  const [hasDeskTop, setHasDeskTop] = useState(false);
  const [productType, setProductType] = useState("chair");
  const [productDetail, setProductDetail] = useState("");
  const [productPrice, setProductPrice] = useState(1000);
  const [productAmount, setProductAmount] = useState(0);
  const [productRemark, setProductRemark] = useState("");

  const [deliveryChecked0, setDeliveryChecked0] = useState(false);
  const [deliveryChecked1, setDeliveryChecked1] = useState(false);
  const [deliveryChecked2, setDeliveryChecked2] = useState(false);
  const [deliveryChecked3, setDeliveryChecked3] = useState(false);

  const [cart, setCart] = useState(initialCart);
  const [cartItemStatus, setCartItemStatus] = useState("add");

  const [chairStocks, setChairStocks] = useState([]);
  const [deskStocks, setDeskStocks] = useState([]);
  const [accessoryStocks, setAccessoryStocks] = useState([]);
  const [initAccessoryStocks, setInitAccessoryStocks] = useState([]);
  const [stocksIndex, setStocksIndex] = useState(0);

  const [chairFeatures, setChairFeatures] = useState([]);
  const [deskFeatures, setDeskFeatures] = useState([]);
  // const [accessoryFeatures, setAccessoryFeatures] = useState([]);

  const [chairFilterBrand, setChairFilterBrand] = useState(null);
  const [chairFilterModel, setChairFilterModel] = useState(null);
  const [deskFilterSupplier, setDeskFilterSupplier] = useState(null);
  const [deskFilterModel, setDeskFilterModel] = useState(null);
  const [deskFilterColor, setDeskFilterColor] = useState(null);
  const [accessoryFilterCategory, setAccessoryFilterCategory] = useState("All");

  let initServices = initialServices
    ? initialServices.map((service) =>
        Object.assign(service, { productType: "misc" })
      )
    : [];
  const [services, setServices] = useState(initServices);

  const [selectedHideChairColumns, setSelectedHideChairColumns] = useState([]);
  const [selectedHideDeskColumns, setSelectedHideDeskColumns] = useState([]);

  const getChairFeatures = (cancelToken) => {
    axios
      .get("/chairStock/features", { cancelToken })
      .then((response) => {
        // handle success
        setChairFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeskFeatures = (cancelToken) => {
    axios
      .get("/deskStock/features", { cancelToken })
      .then((response) => {
        // handle success
        setDeskFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getAccessoryFeatures = (cancelToken) => {
    axios
      .get("/accessoryStock/features", { cancelToken })
      .then((response) => {
        // handle success
        //setAccessoryFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getChairStocks = (cancelToken) => {
    axios
      .get("/chairStock", { cancelToken })
      .then((response) => {
        // handle success
        setChairStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeskStocks = (cancelToken) => {
    axios
      .get("/deskStock", { cancelToken })
      .then((response) => {
        // handle success
        setDeskStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getAccessoryStocks = (cancelToken) => {
    axios
      .get("/accessoryStock", { cancelToken })
      .then((response) => {
        // handle success
        setAccessoryStocks(response.data);
        setInitAccessoryStocks(response.data);
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
    getChairFeatures(source.token);
    getDeskFeatures(source.token);
    getAccessoryFeatures(source.token);
    getChairStocks(source.token);
    getDeskStocks(source.token);
    getAccessoryStocks(source.token);
    return () => source.cancel("Stock Component got unmounted");
  }, []);

  const isStepFailed = (step) => {
    if (clientForm.current !== null && currentStep > 0 && step === 0)
      return !clientForm.current.checkValidity();
    else if (
      cart.length === 0 &&
      services.length === 0 &&
      currentStep > 1 &&
      step === 1
    )
      return true;
    else return false;
  };

  const handleProductRemark = (e) => {
    setProductRemark(e.target.value);
  };

  const handleAccessoryFilterCategory = (e) => {
    var selected_category = e.target.value;
    setAccessoryFilterCategory(selected_category);
    if (selected_category === "All") {
      setAccessoryStocks(initAccessoryStocks);
    } else {
      setAccessoryStocks(
        initAccessoryStocks.filter(
          (stock) => stock.category === selected_category
        )
      );
    }
  };

  const onAddService = () => {
    const newService = {
      id: uuidv4(),
      description: "",
      price: 0,
      productType: "misc",
    };
    setServices([...services, newService]);
  };

  const onDeleteService = (serviceId) => {
    const newServices = services.filter((service) => service.id !== serviceId);
    setServices(newServices);
  };

  const onChangeServiceDes = (e, serviceId) => {
    const newServices = services.map((service) => {
      if (service.id === serviceId) {
        return Object.assign({}, service, { description: e.target.value });
      }
      return service;
    });
    setServices(newServices);
  };

  const onChangeServicePrice = (e, serviceId) => {
    const newServices = services.map((service) => {
      if (service.id === serviceId) {
        return Object.assign({}, service, {
          price: parseFloat(e.target.value),
        });
      }
      return service;
    });
    setServices(newServices);
  };

  const onHideChairColumnChanged = (values) => {
    setSelectedHideChairColumns(values);
  };

  const onHideDeskColumnChanged = (values) => {
    setSelectedHideDeskColumns(values);
  };

  const onEditCartProduct = (item) => {
    setCartItemStatus("edit");
    setProductType(item.productType);
    setProductDetail(item.productDetail);
    setProductRemark(item.remark);
    setProductPrice(item.productPrice);
    setProductAmount(item.productAmount);
    const deliveryOptions = JSON.parse(item.productDeliveryOption);

    if (deliveryOptions.includes("Delivery Included"))
      setDeliveryChecked0(true);
    if (deliveryOptions.includes("Delivery and installation included"))
      setDeliveryChecked1(true);
    if (deliveryOptions.includes("Remote Area Surcharge"))
      setDeliveryChecked2(true);
    if (deliveryOptions.includes("Stairs Surcharge")) setDeliveryChecked3(true);

    if (item.productType === "chair" || item.productType === "accessory") {
      setAddOpen(true);
    } else if (item.productType === "desk") {
      setHasDeskTop(item.hasDeskTop);
      setTopColor(item.topColor);
      setTopCornerRadius(item.topCornerRadius);
      setTopHoleCount(item.topHoleCount);
      setTopHolePosition(item.topHolePosition);
      setTopHoleType(item.topHoleType);
      setTopLength(item.topLength);
      setTopMaterial(item.topMaterial);
      setTopRoundedCorners(item.topRoundedCorners);
      setTopThickness(item.topThickness);
      setTopWidth(item.topWidth);
      setSketchUrl(item.topSketchURL);

      setDeskAddOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "20px 20px 10px 20px",
      }}
    >
      <Stepper activeStep={currentStep} sx={{ flexWrap: "wrap" }}>
        {steps.map((label, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {["Invalid Input", "Products cannot be empty"][index]}
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label} sx={{ my: "10px" }}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        sx={{ mx: "auto", mt: "50px" }}
        ref={clientForm}
        hidden={currentStep !== 0}
        component="form"
        maxWidth="sm"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentStep(1);
        }}
      >
        <Paper
          sx={{
            p: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: "100%", minWidth: "100%" }}>
            Client Info
          </Typography>
          {[
            { name: "name", label: "Name", type: "text", defaultValue: initialClient.name, width: "100%", required: true, },
            { name: "phone", label: "Phone", type: "text", value: initialClient.phone, onChange: initialClient.setPhone, width: "48%", },
            { name: "email", label: "Email", type: "email", defaultValue: initialClient.email, width: "48%", },
            { name: "district", label: "District", type: "text", defaultValue: initialClient.district, width: "55%", },
            { name: "street", label: "Street", type: "text", defaultValue: initialClient.street, width: "40%", },
            { name: "block", label: "Block", type: "text", defaultValue: initialClient.block, width: "30%", },
            { name: "floor", label: "Floor", type: "text", defaultValue: initialClient.floor, width: "30%", },
            { name: "unit", label: "Unit", type: "text", defaultValue: initialClient.unit, width: "30%", },
          ].map(({ setValue, width, ...restProps }, index) =>
            restProps.label === "Phone" ? (
              <MuiPhoneNumber
                key={index}
                variant="outlined"
                onlyCountries={["hk"]}
                defaultCountry={"hk"}
                sx={{ flexBasis: width, minWidth: width }}
                margin="dense"
                size="small"
                {...restProps}
              />
            ) : (
              <TextField
                key={index}
                sx={{ flexBasis: width, minWidth: width }}
                {...restProps}
              />
            )
          )}
          <TextField
            sx={{ flexBasis: ["100%", "30%"], minWidth: ["100%", "30%"] }}
            name="timeLine"
            label="TimeLine"
            type="number"
            inputProps={{ min: 0 }}
            defaultValue={initialClient.timeLine || 0}
          />
          <RadioGroup
            row
            name="timeLineFormat"
            defaultValue="day"
            sx={{
              flexBasis: ["100%", "70%"],
              minWidth: ["100%", "70%"],
              justifyContent: "flex-end",
            }}
          >
            <FormControlLabel value="day" control={<Radio />} label="Days" />
            <FormControlLabel value="week" control={<Radio />} label="Weeks" />
          </RadioGroup>
          <TextField
            sx={{ flexBasis: ["100%", "100%"], minWidth: ["100%", "100%"] }}
            name="remark" label="Delivery Remark" type="text"
            defaultValue={initialClient.remark || ''}
          />
        </Paper>
        <Button type="submit" sx={{ marginTop: "10px", float: "right" }}>
          Next
        </Button>
      </Box>
      {currentStep === 1 && (
        <>
          {cart.length > 0 && (
            <Paper>
              <ProductList sx={{ px: "10px" }}>
                {cart.map((item, index) => (
                  <ProductListItem
                    key={index}
                    secondaryAction={
                      <Fragment>
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            onEditCartProduct(item);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            setCart(
                              cart.filter(
                                (product, productIndex) =>
                                  productIndex !== index
                              )
                            );
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Fragment>
                    }
                  >
                    {item.productType === "chair" && (
                      <ProductListItemText
                        primary={`Chair: ${item.productDetail.brand}, ${item.productDetail.model}, ${item.remark}`}
                        secondary={`${
                          item.productDetail.withHeadrest ? "Headrest, " : ""
                        }${item.productDetail.withAdArmrest ? "Armrest" : ""}`}
                      />
                    )}
                    {item.productType === "desk" && (
                      <ProductListItemText
                        primary={`Desk: ${item.productDetail.supplierCode}, ${item.productDetail.model}, ${item.productDetail.color}, ${item.productDetail.armSize}, ${item.productDetail.feetSize}, ${item.productDetail.beamSize}`}
                        secondary={
                          item.hasDeskTop
                            ? `${item.topMaterial}, ${item.topColor}, ${item.topLength}x${item.topWidth}x${item.topThickness}, ${item.topRoundedCorners}-R${item.topCornerRadius}, ${item.topHoleCount}-${item.topHoleType}`
                            : "Without DeskTop"
                        }
                      />
                    )}
                    {item.productType === "accessory" && (
                      <ProductListItemText
                        primary={`Accessory: ${item.productDetail.category}`}
                        secondary={`${item.remark}`}
                      />
                    )}
                    <ProductPriceAmount
                      unitPrice={`${item.productPrice} HKD`}
                      amount={`Amount: ${item.productAmount}`}
                      deliveryOption={`${item.productDeliveryOption}`}
                    />
                  </ProductListItem>
                ))}
              </ProductList>
            </Paper>
          )}
          <Paper sx={{ my: "10px" }}>
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
                <Tab label="Miscs" />
              </Tabs>
            </Box>
            <TabPanel value={stocksIndex} index={0}>
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
                    value: chairFilterBrand,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setChairFilterBrand(value);
                      setChairFilterModel(null);
                    },
                    options: chairFeatures
                      .map((item) => item.brand)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                  {
                    label: "Model",
                    value: chairFilterModel,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setChairFilterModel(value);
                    },
                    options: chairFeatures
                      .filter(
                        (item) =>
                          !chairFilterBrand || item.brand === chairFilterBrand
                      )
                      .map((item) => item.model)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                ].map(({ label, ...props }, index) => (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: "200px", maxWidth: "200px" }}
                    renderInput={(params) => (
                      <TextField {...params} label={label} />
                    )}
                    {...props}
                  />
                ))}
              </Paper>
              <CheckableMultiSelect
                options={hideChairColumns}
                onChange={onHideChairColumnChanged}
                selected={selectedHideChairColumns}
              />
              <DataGrid
                nonSelect={true}
                title="Chair Stocks"
                rows={chairStocks
                  .map(
                    (
                      {
                        thumbnailURL,
                        withHeadrest,
                        withAdArmrest,
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
                      add: (
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            if (
                              cart.find(
                                (item) =>
                                  item.productType === "chair" &&
                                  item.productDetail.id ===
                                    chairStocks[index].id
                              )
                            ) {
                              Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "This product is already added.",
                                allowOutsideClick: false,
                              });
                              return;
                            }
                            setProductType("chair");
                            setProductDetail(chairStocks[index]);
                            let frameColor =
                              chairStocks[index].frameColor === ""
                                ? "___"
                                : chairStocks[index].frameColor;
                            let seatColor =
                              chairStocks[index].seatColor === ""
                                ? "___"
                                : chairStocks[index].seatColor;
                            let backColor =
                              chairStocks[index].backColor === ""
                                ? "___"
                                : chairStocks[index].backColor;
                            let remark =
                              "FrameColor:" +
                              frameColor +
                              ", SeatColor:" +
                              seatColor +
                              ", BackColor:" +
                              backColor;
                            setProductRemark(remark);
                            setProductPrice(chairStocks[index].unitPrice);
                            setProductAmount(1);
                            setAddOpen(true);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                      shipmentDate: (() => {
                        if (shipmentDate === null) return "No";
                        const createdTime = new Date(shipmentDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split("T")[0];
                      })(),
                      arrivalDate: (() => {
                        if (arrivalDate === null) return "No";
                        const createdTime = new Date(arrivalDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split("T")[0];
                      })(),
                      ...restProps,
                    })
                  )
                  .filter(
                    (item) =>
                      (!chairFilterBrand || item.brand === chairFilterBrand) &&
                      (!chairFilterModel || item.model === chairFilterModel)
                  )}
                columns={chairColumns
                  .map((column, i) => {
                    if (i > 6) {
                      if (
                        selectedHideChairColumns.find(
                          (hideColumn) => hideColumn === column.label
                        )
                      )
                        return column;
                    }
                    return column;
                  })
                  .filter((column) => column !== undefined)}
              />
            </TabPanel>
            <TabPanel value={stocksIndex} index={1}>
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
                    label: "Supplier",
                    value: deskFilterSupplier,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setDeskFilterSupplier(value);
                      setDeskFilterModel(null);
                      setDeskFilterColor(null);
                    },
                    options: deskFeatures
                      .map((item) => item.supplierCode)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                  {
                    label: "Model",
                    value: deskFilterModel,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setDeskFilterModel(value);
                      setDeskFilterColor(null);
                    },
                    options: deskFeatures
                      .filter(
                        (item) =>
                          !deskFilterSupplier ||
                          item.supplierCode === deskFilterSupplier
                      )
                      .map((item) => item.model)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                  {
                    label: "Color",
                    value: deskFilterColor,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setDeskFilterColor(value);
                    },
                    options: deskFeatures
                      .filter(
                        (item) =>
                          !deskFilterModel || item.model === deskFilterModel
                      )
                      .map((item) => item.color)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                ].map(({ label, ...props }, index) => (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: "200px", maxWidth: "200px" }}
                    renderInput={(params) => (
                      <TextField {...params} label={label} />
                    )}
                    {...props}
                  />
                ))}
              </Paper>
              <CheckableMultiSelect
                options={hideDeskColumns}
                onChange={onHideDeskColumnChanged}
                selected={selectedHideDeskColumns}
              />
              <DataGrid
                nonSelect={true}
                title="Desk Leg Stocks"
                rows={deskStocks
                  .map(
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
                      add: (
                        <IconButton
                          onClick={(event) => {
                            setProductType("desk");
                            setProductDetail(deskStocks[index]);
                            setProductPrice(deskStocks[index].unitPrice);
                            setProductAmount(1);
                            setHasDeskTop(false);
                            setDeskAddOpen(true);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                      shipmentDate: (() => {
                        if (shipmentDate === null) return "No";
                        const createdTime = new Date(shipmentDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split("T")[0];
                      })(),
                      arrivalDate: (() => {
                        if (arrivalDate === null) return "No";
                        const createdTime = new Date(arrivalDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split("T")[0];
                      })(),
                      ...restProps,
                    })
                  )
                  .filter(
                    (item) =>
                      (!deskFilterSupplier ||
                        item.supplierCode === deskFilterSupplier) &&
                      (!deskFilterModel || item.model === deskFilterModel) &&
                      (!deskFilterColor || item.color === deskFilterColor)
                  )}
                columns={deskColumns
                  .map((column, i) => {
                    if (i > 6) {
                      if (
                        selectedHideDeskColumns.find(
                          (hideColumn) => hideColumn === column.label
                        )
                      )
                        return column;
                    }
                    return column;
                  })
                  .filter((column) => column !== undefined)}
              />
            </TabPanel>
            <TabPanel value={stocksIndex} index={2}>
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
                    value={accessoryFilterCategory}
                    onChange={handleAccessoryFilterCategory}
                  >
                    <MenuItem value="All">All</MenuItem>
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
              </Paper>
              <DataGrid
                nonSelect={true}
                title="Accessory Stocks"
                rows={accessoryStocks.map(
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
                    add: (
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          setProductType("accessory");
                          setProductDetail(accessoryStocks[index]);
                          setProductRemark(accessoryStocks[index].remark);
                          setProductPrice(accessoryStocks[index].unitPrice);
                          setProductAmount(1);
                          if (
                            cart.find(
                              (item) =>
                                item.productType === "accessory" &&
                                item.productDetail.id ===
                                  accessoryStocks[index].id
                            )
                          ) {
                            Swal.fire({
                              icon: "warning",
                              title: "Warning",
                              text: "This product is already added.",
                              allowOutsideClick: false,
                            });
                            return;
                          }
                          setAddOpen(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                    shipmentDate: (() => {
                      if (shipmentDate === null) return "No";
                      const createdTime = new Date(shipmentDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split("T")[0];
                    })(),
                    arrivalDate: (() => {
                      if (arrivalDate === null) return "No";
                      const createdTime = new Date(arrivalDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split("T")[0];
                    })(),
                    ...restProps,
                  })
                )}
                columns={accessoryColumns}
              />
            </TabPanel>
            <TabPanel value={stocksIndex} index={3}>
              <Box sx={{ m: 3 }}>
                <Button
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={onAddService}
                >
                  + New Service
                </Button>
                <Grid container spacing={2}>
                  {services.map((service) => (
                    <Grid item xs={4} key={service.id}>
                      <Card sx={{ px: 2, pb: 2 }}>
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton
                            aria-label="settings"
                            size="small"
                            onClick={() => onDeleteService(service.id)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <TextField
                          label="Description"
                          multiline
                          rows={5}
                          sx={{ flexBasis: "100%", minWidth: "100%" }}
                          value={service.description}
                          onChange={(e) => onChangeServiceDes(e, service.id)}
                        />
                        <TextField
                          type="number"
                          sx={{ flexBasis: "100%", minWidth: "100%" }}
                          label="Price"
                          value={service.price}
                          onChange={(e) => onChangeServicePrice(e, service.id)}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep(0);
            }}
          >
            Previous
          </Button>
          <Button
            sx={{ float: "right" }}
            onClick={(e) => {
              e.preventDefault();
              if (cart.length === 0 && services.length === 0) {
                Swal.fire({
                  icon: "warning",
                  title: "Warning",
                  text: "Products and services list cannot be empty",
                  allowOutsideClick: false,
                });
                return;
              }
              setCurrentStep(2);
            }}
          >
            Next
          </Button>
        </>
      )}
      <Box
        sx={{ mx: "auto", mt: "50px" }}
        hidden={currentStep !== 2}
        component="form"
        maxWidth="sm"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          const clientData = new FormData(clientForm.current);
          const paymentData = new FormData(e.currentTarget);
          if (componentType === "create")
            axios
              .post(`/quotation/create`, {
                name: clientData.get("name"),
                phone: clientData.get("phone"),
                email: clientData.get("email"),
                district: clientData.get("district"),
                street: clientData.get("street"),
                block: clientData.get("block"),
                floor: clientData.get("floor"),
                unit: clientData.get("unit"),
                timeLine:
                  Math.max(clientData.get("timeLine"), 0) *
                  (clientData.get("timeLineFormat") === "day" ? 1 : 7),
                remark: "",
                products: cart
                  .map(({ productDetail, ...restProps }) => ({
                    productId: productDetail.id,
                    productCategory: productDetail.category ?? "",
                    ...restProps,
                  }))
                  .concat(services),
                paymentTerms: paymentData.get("paymentTerms"),
                paid: Boolean(paymentData.get("paid")),
                validTil: paymentData.get("validTil") || null,
                discount: Math.max(
                  paymentData.get("discountType") > 0
                    ? paymentData.get("discount")
                    : Math.min(paymentData.get("discount"), 100),
                  0
                ),
                discountType: paymentData.get("discountType"),
                surcharge: Math.max(
                  paymentData.get("surchargeType") > 0
                    ? paymentData.get("surcharge")
                    : Math.min(paymentData.get("surcharge"), 100),
                  0
                ),
                surchargeType: paymentData.get("surchargeType"),
              })
              .then(() => {
                // handle success
                props.history.push("/user/quotation");
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
              })
              .then(function () {
                // always executed
              });
          else {
            axios
              .put(`/quotation/${initialClient.id}`, {
                name: clientData.get("name"),
                phone: clientData.get("phone"),
                email: clientData.get("email"),
                district: clientData.get("district"),
                street: clientData.get("street"),
                block: clientData.get("block"),
                floor: clientData.get("floor"),
                unit: clientData.get("unit"),
                timeLine:
                  clientData.get("timeLine") *
                  (clientData.get("timeLineFormat") === "day" ? 1 : 7),
                remark: clientData.get("remark"),
                products: cart
                  .map(({ productDetail, ...restProps }) => ({
                    productId: productDetail.id,
                    productCategory: productDetail.category ?? "",
                    ...restProps,
                  }))
                  .concat(services),
                paymentTerms: paymentData.get("paymentTerms"),
                paid: Boolean(paymentData.get("paid")),
                validTil: paymentData.get("validTil") || null,
                discount: Math.max(
                  paymentData.get("discountType") > 0
                    ? paymentData.get("discount")
                    : Math.min(paymentData.get("discount"), 100),
                  0
                ),
                discountType: paymentData.get("discountType"),
                surcharge: Math.max(
                  paymentData.get("surchargeType") > 0
                    ? paymentData.get("surcharge")
                    : Math.min(paymentData.get("surcharge"), 100),
                  0
                ),
                surchargeType: paymentData.get("surchargeType"),
              })
              .then(() => {
                // handle success
                props.history.push("/user/quotation");
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
              })
              .then(function () {
                // always executed
              });
          }
        }}
      >
        <Paper
          sx={{
            p: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: "100%", minWidth: "100%" }}>
            Payment Details
          </Typography>
          <Typography variant="h7" sx={{ flexBasis: "100%", minWidth: "100%" }}>
            Sub Total:{" "}
            {cart.reduce(
              (p, c) => p + c.productAmount * parseFloat(c.productPrice),
              0
            ) + services.reduce((p, c) => p + c.price, 0)}
          </Typography>
          <TextField
            name="paymentTerms"
            size="small"
            sx={{ flexBasis: "100%", minWidth: "100%" }}
            defaultValue={initialClient.paymentTerms}
            label="Payment Terms"
          />
          <FormControlLabel
            sx={{
              flexBasis: "100%",
              minWidth: "100%",
              alignItems: "baseline",
              m: 0,
            }}
            control={
              <TextField
                type="number"
                name="validTil"
                label="Valid Til"
                inputProps={{
                  max: 10,
                  min: 0,
                }}
                defaultValue={initialClient.validTil}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ m: "10px 5px 10px 0" }}
              />
            }
            label="month(s)"
          />
          <TextField
            sx={{
              flexBasis: ["58%", "68%"],
              minWidth: ["58%", "68%"],
              alignItems: "baseline",
              m: 0,
            }}
            label="Discount"
            type="number"
            name="discount"
            inputProps={{
              min: 0,
            }}
            defaultValue={initialClient.discount}
            fullWidth
          />
          <Select
            sx={{
              flexBasis: ["40%", "30%"],
              minWidth: ["40%", "30%"],
              alignItems: "baseline",
              m: 0,
            }}
            name="discountType"
            defaultValue={initialClient.discountType}
          >
            <MenuItem value={0}>%</MenuItem>
            <MenuItem value={1}>HKD</MenuItem>
          </Select>
          <TextField
            sx={{
              flexBasis: ["58%", "68%"],
              minWidth: ["58%", "68%"],
              alignItems: "baseline",
              mt: "10px",
              mb: 0,
            }}
            label="Surcharge"
            type="number"
            name="surcharge"
            inputProps={{
              min: 0,
            }}
            defaultValue={initialClient.surcharge}
            fullWidth
          />
          <Select
            sx={{
              flexBasis: ["40%", "30%"],
              minWidth: ["40%", "30%"],
              alignItems: "baseline",
              mt: "10px",
              mb: 0,
            }}
            name="surchargeType"
            defaultValue={initialClient.surchargeType}
          >
            <MenuItem value={0}>%</MenuItem>
            <MenuItem value={1}>HKD</MenuItem>
          </Select>
        </Paper>
        <Button
          sx={{ marginTop: "10px" }}
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep(1);
          }}
        >
          Previous
        </Button>
        <Button sx={{ float: "right", marginTop: "10px" }} type="submit">
          Finish
        </Button>
      </Box>
      <Dialog
        open={addOpen}
        maxWidth="sm"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);

            setDeliveryChecked0(false);
            setDeliveryChecked1(false);
            setDeliveryChecked2(false);
            setDeliveryChecked3(false);

            setAddOpen(false);
            if (cartItemStatus === "add") {
              if (
                cart.find(
                  (item) =>
                    item.productType === productType &&
                    item.productDetail.id === productDetail.id
                )
              ) {
                Swal.fire({
                  icon: "warning",
                  title: "Warning",
                  text: "This product is already added.",
                  allowOutsideClick: false,
                });
                return;
              }
              setCart(
                cart.concat({
                  productType,
                  productDetail,
                  productAmount,
                  productDeliveryOption: JSON.stringify(
                    [
                      "Delivery Included",
                      "Delivery and installation included",
                      "Remote Area Surcharge",
                      "Stairs Surcharge",
                    ].filter((item, index) =>
                      Boolean(data.get(`deliveryOption_${index}`))
                    )
                  ),
                  productPrice: e.currentTarget.unitPrice.value,
                  remark: productRemark,
                })
              );
            } else if (cartItemStatus === "edit") {
              const newCart = cart.map((item) => {
                if (
                  item.productType === productType &&
                  item.productDetail.id === productDetail.id
                )
                  return {
                    productType,
                    productDetail,
                    productAmount,
                    productDeliveryOption: JSON.stringify(
                      [
                        "Delivery Included",
                        "Delivery and installation included",
                        "Remote Area Surcharge",
                        "Stairs Surcharge",
                      ].filter((item, index) =>
                        Boolean(data.get(`deliveryOption_${index}`))
                      )
                    ),
                    productPrice: e.currentTarget.unitPrice.value,
                    remark: productRemark,
                  };
                else return item;
              });
              setCart(newCart);
            }
          },
        }}
      >
        <DialogTitle>Price and Amount</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <TextField
            label="Unit Price"
            type="number"
            name="unitPrice"
            // inputProps={{ readOnly: true }}
            value={productPrice}
            sx={{ width: "200px" }}
            InputProps={{
              readOnly: true,
              endAdornment: <InputAdornment position="end">HKD</InputAdornment>,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "200px",
              border: "1px solid #0000003b",
              borderRadius: "4px",
              my: "10px",
              mx: "auto",
              p: "5px 3px",
            }}
          >
            <Typography variant="span" sx={{ flexGrow: 1 }}>
              Amount
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.max(productAmount - 1, 1));
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="span" sx={{ ml: "10px" }}>
              {productAmount}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.min(productAmount + 1, 99));
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              my: "10px",
              mx: "auto",
              p: "5px 3px",
            }}
          >
            <TextField
              label="Specification"
              name="remark"
              value={productRemark}
              sx={{ width: 400, mx: "5px" }}
              onChange={handleProductRemark}
            />
          </Box>
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_0"
                checked={deliveryChecked0}
                onChange={(e) => setDeliveryChecked0(e.target.checked)}
                sx={{ textAlign: "left" }}
              />
            }
            label="Delivery Included"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_1"
                checked={deliveryChecked1}
                onChange={(e) => setDeliveryChecked1(e.target.checked)}
              />
            }
            label="Delivery and installation included"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_2"
                checked={deliveryChecked2}
                onChange={(e) => setDeliveryChecked2(e.target.checked)}
              />
            }
            label="Remote Area Surcharge"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_3"
                checked={deliveryChecked3}
                onChange={(e) => setDeliveryChecked3(e.target.checked)}
              />
            }
            label="Stairs Surcharge"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              setDeliveryChecked0(false);
              setDeliveryChecked1(false);
              setDeliveryChecked2(false);
              setDeliveryChecked3(false);
              setAddOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deskAddOpen}
        maxWidth="sm"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        PaperProps={{
          component: "form",
          onSubmit: async (e) => {
            e.preventDefault();

            setTopHoleCount(0);
            setTopHolePosition("Left");
            setTopHoleType("Rounded");
            setTopMaterial("Melamine");
            setTopColor("");
            setTopLength(700);
            setTopWidth(400);
            setTopThickness(25);
            setTopRoundedCorners(0);
            setTopCornerRadius(50);
            setSketchUrl("");

            setDeliveryChecked0(false);
            setDeliveryChecked1(false);
            setDeliveryChecked2(false);
            setDeliveryChecked3(false);

            setDeskAddOpen(false);

            const data = new FormData(e.currentTarget);

            if (cartItemStatus === "add") {
              if (
                !hasDeskTop &&
                cart.find(
                  (item) =>
                    item.productType === "desk" &&
                    item.productDetail.id === productDetail.id &&
                    !item.hasDeskTop
                )
              ) {
                Swal.fire({
                  icon: "warning",
                  title: "Warning",
                  text: "This product is already added.",
                  allowOutsideClick: false,
                });
                return;
              }

              let topSketchURL = "";
              if (data.get("topSketchImg") && data.get("topSketchImg").name) {
                const uploadData = new FormData();
                uploadData.append("file", data.get("topSketchImg"));
                try {
                  const response = await axios.post(`/upload`, uploadData, {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  });
                  topSketchURL = response.data.url;
                } catch (err) {}
              }

              setCart(
                cart.concat({
                  productType,
                  productDetail,
                  productAmount,
                  productDeliveryOption: JSON.stringify(
                    [
                      "Delivery Included",
                      "Delivery and installation included",
                      "Remote Area Surcharge",
                      "Stairs Surcharge",
                    ].filter((item, index) =>
                      Boolean(data.get(`deliveryOption_${index}`))
                    )
                  ),
                  productPrice: Boolean(data.get("hasDeskTop"))
                    ? Number(data.get("deskTotalPrice"))
                    : Number(data.get("deskLegPrice")),
                  hasDeskTop: Boolean(data.get("hasDeskTop")) || false,
                  topMaterial: data.get("topMaterial") || "",
                  topColor: data.get("topColor") || "",
                  topLength: data.get("topLength") || 0,
                  topWidth: data.get("topWidth") || 0,
                  topThickness: data.get("topThickness") || 0,
                  topRoundedCorners: data.get("topRoundedCorners") || 0,
                  topCornerRadius: data.get("topCornerRadius") || 50,
                  topHoleCount: data.get("topHoleCount") || 0,
                  topHoleType: data.get("topHoleType") || "",
                  topHolePosition: topHolePosition || "",
                  remark: data.get("remark") || "",
                  topSketchURL: topSketchURL,
                })
              );
            } else if (cartItemStatus === "edit") {
              let topSketchURL = sketchUrl;
              if (data.get("topSketchImg") && data.get("topSketchImg").name) {
                const uploadData = new FormData();
                uploadData.append("file", data.get("topSketchImg"));
                try {
                  const response = await axios.post(`/upload`, uploadData, {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  });
                  topSketchURL = response.data.url;
                } catch (err) {}
              }
              const newCart = cart.map((item) => {
                if (
                  item.productType === "desk" &&
                  item.productDetail.id === productDetail.id
                )
                  return {
                    productType,
                    productDetail,
                    productAmount,
                    productDeliveryOption: JSON.stringify(
                      [
                        "Delivery Included",
                        "Delivery and installation included",
                        "Remote Area Surcharge",
                        "Stairs Surcharge",
                      ].filter((item, index) =>
                        Boolean(data.get(`deliveryOption_${index}`))
                      )
                    ),
                    productPrice: Boolean(data.get("hasDeskTop"))
                      ? Number(data.get("deskTotalPrice"))
                      : Number(data.get("deskLegPrice")),
                    hasDeskTop: Boolean(data.get("hasDeskTop")) || false,
                    topMaterial: data.get("topMaterial") || "",
                    topColor: data.get("topColor") || "",
                    topLength: data.get("topLength") || 0,
                    topWidth: data.get("topWidth") || 0,
                    topThickness: data.get("topThickness") || 0,
                    topRoundedCorners: data.get("topRoundedCorners") || 0,
                    topCornerRadius: data.get("topCornerRadius") || 50,
                    topHoleCount: data.get("topHoleCount") || 0,
                    topHoleType: data.get("topHoleType") || "",
                    topHolePosition: topHolePosition || "",
                    remark: data.get("remark") || "",
                    topSketchURL: topSketchURL,
                  };
                else return item;
              });
              setCart(newCart);
            }
          },
        }}
      >
        <DialogTitle>Price and Amount</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <TextField
            label="Desk Leg Price"
            type="number"
            name="deskLegPrice"
            value={productPrice}
            sx={{ width: 200, visibility: hasDeskTop ? "hidden" : "visible" }}
            InputProps={{
              readOnly: true,
              endAdornment: <InputAdornment position="end">HKD</InputAdornment>,
            }}
          />
          <Divider sx={{ my: "10px" }} />
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <FormControlLabel
              control={
                <Checkbox
                  name="hasDeskTop"
                  checked={hasDeskTop}
                  onChange={(e) => {
                    setHasDeskTop(e.currentTarget.checked);
                  }}
                />
              }
              label="with Table Top"
              sx={{ flexBasis: "100%", minWidth: "100%" }}
            />
            {[
              {
                name: "topMaterial",
                label: "Material",
                type: "autocomplete",
                value: topMaterial,
                onChange: (e, newVal) => {
                  e.preventDefault();
                  setTopMaterial(newVal);
                },
                options: materialOptions,
                width: "65%",
              },
              {
                name: "topColor",
                label: "Color",
                type: "text",
                width: "30%",
                value: topColor,
                onChange: (e) => {
                  e.preventDefault();
                  setTopColor(e.target.value);
                },
              },
              {
                name: "topLength",
                label: "Length",
                type: "suffixNumber",
                suffix: "mm",
                inputProps: { min: 0 },
                width: "30%",
                value: topLength,
                onChange: (e) => {
                  e.preventDefault();
                  setTopLength(e.target.value);
                },
              },
              {
                name: "topWidth",
                label: "Width",
                type: "suffixNumber",
                suffix: "mm",
                inputProps: { min: 0 },
                width: "30%",
                value: topWidth,
                onChange: (e) => {
                  e.preventDefault();
                  setTopWidth(e.target.value);
                },
              },
              {
                name: "topThickness",
                label: "Thickness",
                type: "suffixNumber",
                suffix: "mm",
                inputProps: { min: 0 },
                width: "30%",
                value: topThickness,
                onChange: (e) => {
                  e.preventDefault();
                  setTopThickness(e.target.value);
                },
              },
              {
                name: "topRoundedCorners",
                label: "Rounded Corners",
                type: "select",
                options: [0, 1, 2, 3, 4],
                width: "48%",
                value: topRoundedCorners,
                onChange: (e) => {
                  e.preventDefault();
                  setTopRoundedCorners(e.target.value);
                },
              },
              {
                name: "topCornerRadius",
                label: "Corner Radius",
                type: "number",
                inputProps: { min: 0 },
                width: "48%",
                value: topCornerRadius,
                onChange: (e) => {
                  e.preventDefault();
                  setTopCornerRadius(e.target.value);
                },
              },
              {
                name: "topHoleCount",
                label: "Number of Holes",
                type: "select",
                value: topHoleCount,
                onChange: (e) => {
                  e.preventDefault();
                  setTopHoleCount(e.target.value);
                  if (e.target.value === 1) setTopHolePosition("Left");
                  else if (e.target.value === 2)
                    setTopHolePosition("Left_Right");
                  else if (e.target.value === 3)
                    setTopHolePosition("Left_Right_Center");
                },
                options: [0, 1, 2, 3],
                width: "48%",
              },
              {
                name: "topHoleType",
                label: "Type of Holes",
                type: "select",
                value: topHoleType,
                onChange: (e) => {
                  e.preventDefault();
                  setTopHoleType(e.target.value);
                },
                options: ["Rounded", "Rectangular"],
                width: "48%",
              },
              {
                name: "topHolePosition",
                label: "Hole Position",
                type: "select",
                value: topHolePosition,
                onChange: (e) => {
                  e.preventDefault();
                  setTopHolePosition(e.target.value);
                },
                options:
                  topHoleCount === 1
                    ? ["Left", "Right", "Center"]
                    : [
                        "Left",
                        "Right",
                        "Center",
                        "Left_Right",
                        "Left_Right_Center",
                      ],
                disabled: topHoleCount !== 1, // || topHoleType !== "Rounded",
                visible: "true", //topHoleType === "Rounded" ? "1" : "0",
                width: "48%",
              },
              {
                name: "remark",
                label: "Specification",
                type: "text",
                width: "100%",
                value: productRemark,
                onChange: (e) => {
                  e.preventDefault();
                  setProductRemark(e.target.value);
                },
              },
              {
                name: "topSketchImg",
                label: "Sketch Image (Optional)",
                type: "file",
                inputProps: {
                  accept: "image/png, image/gif, image/jpeg",
                },
                InputLabelProps: { shrink: true },
                width: "100%",
              },
            ].map(({ type, width, ...restParams }, index) => {
              if (type === "autocomplete") {
                const { name, label, ...autocomParams } = restParams;
                return (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: width, minWidth: width }}
                    renderInput={(params) => (
                      <TextField {...params} name={name} label={label} />
                    )}
                    disabled={!hasDeskTop}
                    {...autocomParams}
                  />
                );
              } else if (type === "suffixNumber") {
                const { suffix, ...fieldParams } = restParams;
                return (
                  <FormControlLabel
                    key={index}
                    sx={{
                      flexBasis: width,
                      minWidth: width,
                      alignItems: "baseline",
                      mx: 0,
                    }}
                    control={
                      <TextField
                        fullWidth
                        sx={{ m: "10px 5px 0 0" }}
                        type="number"
                        disabled={!hasDeskTop}
                        {...fieldParams}
                      />
                    }
                    label={suffix}
                  />
                );
              } else if (type === "select") {
                const { name, label, options, ...selectParams } = restParams;
                if (name === "topHolePosition")
                  if (selectParams.visible === "1")
                    return (
                      <FormControl
                        key={index}
                        sx={{ flexBasis: width, minWidth: width }}
                      >
                        <InputLabel id={`desk-top-${name}-select-label`}>
                          {label}
                        </InputLabel>
                        <Select
                          labelId={`desk-top-${name}-select-label`}
                          id={`desk-top-${name}-select`}
                          name={name}
                          label={label}
                          size="small"
                          disabled={!hasDeskTop}
                          {...selectParams}
                        >
                          {options.map((selectOption, selectOptionIndex) => (
                            <MenuItem
                              key={selectOptionIndex}
                              value={selectOption}
                            >
                              {selectOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  else return "";
                else
                  return (
                    <FormControl
                      key={index}
                      sx={{ flexBasis: width, minWidth: width }}
                    >
                      <InputLabel id={`desk-top-${name}-select-label`}>
                        {label}
                      </InputLabel>
                      <Select
                        labelId={`desk-top-${name}-select-label`}
                        id={`desk-top-${name}-select`}
                        name={name}
                        label={label}
                        size="small"
                        disabled={!hasDeskTop}
                        {...selectParams}
                      >
                        {options.map((selectOption, selectOptionIndex) => (
                          <MenuItem
                            key={selectOptionIndex}
                            value={selectOption}
                          >
                            {selectOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
              } else
                return (
                  <TextField
                    key={index}
                    type={type}
                    sx={{ flexBasis: width, minWidth: width }}
                    disabled={!hasDeskTop}
                    {...restParams}
                  />
                );
            })}
            <TextField
              label="Desk Total Price"
              type="number"
              name="deskTotalPrice"
              defaultValue={productPrice}
              sx={{ flexBasis: 200, minWidth: 200, mx: "auto" }}
              disabled={!hasDeskTop}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">HKD</InputAdornment>
                ),
              }}
            />
          </Box>
          <Divider sx={{ my: "10px" }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "200px",
              border: "1px solid #0000003b",
              borderRadius: "4px",
              mt: "10px",
              mx: "auto",
              p: "5px 3px",
            }}
          >
            <Typography variant="span" sx={{ flexGrow: 1 }}>
              Amount
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.max(productAmount - 1, 1));
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="span" mx="10px">
              {productAmount}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.min(productAmount + 1, 99));
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_0"
                checked={deliveryChecked0}
                onChange={(e) => setDeliveryChecked0(e.target.checked)}
                sx={{ textAlign: "left" }}
              />
            }
            label="Delivery Included"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_1"
                checked={deliveryChecked1}
                onChange={(e) => setDeliveryChecked1(e.target.checked)}
              />
            }
            label="Delivery and installation included"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_2"
                checked={deliveryChecked2}
                onChange={(e) => setDeliveryChecked2(e.target.checked)}
              />
            }
            label="Remote Area Surcharge"
          />
          <FormControlLabel
            sx={{ display: "block", textAlign: "left", marginLeft: "100px" }}
            control={
              <Checkbox
                name="deliveryOption_3"
                checked={deliveryChecked3}
                onChange={(e) => setDeliveryChecked3(e.target.checked)}
              />
            }
            label="Stairs Surcharge"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setTopHoleCount(0);
              setTopHolePosition("Left");
              setTopHoleType("Rounded");
              setTopMaterial("Melamine");
              setTopColor("");
              setTopLength(700);
              setTopWidth(400);
              setTopThickness(25);
              setTopRoundedCorners(0);
              setTopCornerRadius(50);
              setSketchUrl("");

              setDeliveryChecked0(false);
              setDeliveryChecked1(false);
              setDeliveryChecked2(false);
              setDeliveryChecked3(false);

              setDeskAddOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
