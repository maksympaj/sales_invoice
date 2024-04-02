import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Deck as DeckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  // PictureAsPdf as PictureAsPdfIcon,
  WhatsApp as WhatsAppIcon,
  DriveFolderUpload as DriveFolderUploadIcon,
} from "@mui/icons-material";
import MuiPhoneNumber from "material-ui-phone-number";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Swal from "sweetalert2";
import QRCode from "react-qr-code";

import DataGrid from "components/Common/DataGrid";
import {
  ProductList,
  ProductListItem,
  ProductListItemText,
  ProductPriceAmount,
} from "../ProductList";
import CheckableMultiSelect from "components/Common/MultiSelect";

const columns = [
  {
    id: "quotationNum",
    label: "Quotation",
  },
  {
    id: "name",
    label: "Client",
  },
  {
    id: "seller",
    label: "Seller",
  },
  {
    id: "quotationDate",
    label: "Quotation",
  },
  {
    id: "clientAddress",
    label: "Address",
  },
  {
    id: "timeLine",
    label: "TimeLine",
  },
  {
    id: "remark",
    label: "Remark",
  },
  {
    id: "discount",
    label: "Discount",
  },
  {
    id: "surcharge",
    label: "SurCharge",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "paid",
    label: "Paid",
  },
  {
    id: "emailIcon",
    nonSort: true,
    label: "Con",
    align: "right",
    sx: { maxWidth: 45, width: 45 },
  },
  {
    id: "whatsappIcon",
    nonSort: true,
    label: "tact",
    align: "left",
    sx: { maxWidth: 45, width: 45, paddingLeft: 0 },
  },
  {
    id: "toInvoice",
    nonSort: true,
    label: "To Invoice",
    sx: { maxWidth: 45 },
  },
  {
    id: "edit",
    nonSort: true,
    sx: { maxWidth: 45, width: 45 },
  },
  {
    nonSort: true,
    id: "delete",
    sx: { maxWidth: 45, width: 45 },
  },
];
const hideColumns = [
  "Address",
  "TimeLine",
  "Remark",
  "Discount",
  "SurCharge",
  "Products",
  "Paid",
  "Con",
  "tact",
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [quotations, setquotations] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const whatsAppMessage = useRef(null);
  const emailContent = useRef(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [quotationIndex, setquotationIndex] = useState(0);

  const [selectedHideColumns, setSelectedHideColumns] = useState([]);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleWhatsAppSend = (event) => {
    event.preventDefault();
    axios
      .post("whatsapp/send", {
        phone: phone,
        message: whatsAppMessage.current.value,
      })
      .then(() => {
        setWhatsAppOpen(false);
      })
      .catch(function (error) {
        // handle error
        setWhatsAppOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setWhatsAppOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleEmailSend = (event) => {
    event.preventDefault();
    axios
      .post("email/send", {
        email: email,
        message: emailContent.current.value,
      })
      .then(() => {
        setEmailOpen(false);
      })
      .catch(function (error) {
        // handle error
        setEmailOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEmailOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleEditClick = (index) => {
    if (index < quotations.length && index >= 0) {
    }
  };

  const handleRemoveClick = (index) => {
    if (index < quotations.length && index >= 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will remove current Quotation permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "No, Keep It.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/quotation/${quotations[index].id}`)
            .then((response) => {
              // handle success
              getQuotations();
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
      text: "This action will remove selected Quotations permanently.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove!",
      cancelButtonText: "No, Keep Them.",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/quotation", {
            data: { ids: selected },
          })
          .then((response) => {
            // handle success
            getQuotations();
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

  const handleToInvoiceClick = (index) => {
    if (index < quotations.length && index >= 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will convert current Quotation to Invoice.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Convert!",
        cancelButtonText: "No, Cancel.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const quotation = quotations[index];

          const cart = quotation.ChairStocks.map(
            ({ ChairToQuotation, ...restProps }) => ({
              productType: "chair",
              productDetail: restProps,
              remark: ChairToQuotation.remark,
              productPrice: ChairToQuotation.unitPrice,
              productAmount: ChairToQuotation.qty,
              productDeliveryOption: ChairToQuotation.deliveryOption,
            })
          )
            .concat(
              quotation.DeskToQuotations.map((DeskToQuotation) => {
                const {
                  stockId,
                  unitPrice,
                  qty,
                  deliveryOption,
                  ...deskTopProps
                } = DeskToQuotation;

                const stock = quotation.DeskStocks.find(function (val) {
                  return val.id === stockId;
                });

                return {
                  productType: "desk",
                  productDetail: stock,
                  productPrice: unitPrice,
                  productAmount: qty,
                  productDeliveryOption: deliveryOption,
                  ...deskTopProps,
                };
              })
            )
            .concat(
              quotation.AccessoryStocks.map(
                ({ AccessoryToQuotation, ...restProps }) => ({
                  productType: "accessory",
                  productDetail: restProps,
                  remark: AccessoryToQuotation.remark,
                  productPrice: AccessoryToQuotation.unitPrice,
                  productAmount: AccessoryToQuotation.qty,
                  productDeliveryOption: AccessoryToQuotation.deliveryOption,
                })
              )
            ).concat(
              quotation.ServiceToQuotations.map(
                ({ description, id, price }) => ({
                  productType: "misc",
                  id: id,
                  price: price,
                  description: description
                })
              )
            );
          axios
            .post(`/sales/create`, {
              name: quotation.name,
              phone: quotation.phone,
              email: quotation.email,
              district: quotation.district,
              street: quotation.street,
              block: quotation.block,
              floor: quotation.floor,
              unit: quotation.unit,
              timeLine: quotation.timeLine,
              remark: quotation.remark,
              products: cart
                .map(({ productDetail, ...restProps }) => ({
                  productId: productDetail?.id,
                  ...restProps,
                }))
                .concat(quotation.ServiceToQuotations),
              paymentTerms: quotation.paymentTerms,
              paid: false,
              dueDate: null,
              discount: quotation.discount,
              discountType: quotation.discountType,
              surcharge: quotation.surcharge,
              surchargeType: quotation.surchargeType,
            })
            .then(() => {
              // handle success
              props.history.push("/admin/sales");
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message,
                allowOutsideClick: false,
              }).then(() => { });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const getQuotations = (cancelToken) => {
    axios
      .get("/quotation", { cancelToken })
      .then((response) => {
        // handle success
        setquotations(response.data);
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
    getQuotations(source.token);
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
        to="/admin/quotation/create"
        startIcon={<AddIcon />}
      >
        New Quotation
      </Button>
      <div>
        <CheckableMultiSelect
          options={hideColumns}
          onChange={onHideColumnChanged}
          selected={selectedHideColumns}
        />
      </div>
      <DataGrid
        title="Sales quotations"
        rows={quotations.map(
          (
            {
              id,
              quotationNum,
              district,
              street,
              block,
              floor,
              unit,
              Seller,
              discount,
              discountType,
              surcharge,
              surchargeType,
              createdAt,
              timeLine,
              paid,
              ChairStocks,
              DeskStocks,
              AccessoryStocks,
              ...restProps
            },
            index
          ) => ({
            id,
            index,
            seller: (Seller.firstName || "").concat(" ", Seller.lastName || ""),
            timeLine:
              timeLine % 7 !== 0
                ? `${timeLine} day${timeLine === 1 ? "" : "s"}`
                : `${timeLine / 7} week${timeLine / 7 === 1 ? "" : "s"}`,
            quotationDate: (() => {
              const createdTime = new Date(createdAt);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split("T")[0];
            })(),
            discount: `${discount}${discountType ? " HKD" : "%"}`,
            surcharge: `${surcharge}${surchargeType ? " HKD" : "%"}`,
            clientAddress: [district, street, block, floor, unit].join(", "),
            products: (
              <IconButton
                sx={{ my: "5px" }}
                onClick={(event) => {
                  event.preventDefault();
                  setquotationIndex(index);
                  setDetailOpen(true);
                }}
              >
                <Badge
                  badgeContent={
                    ChairStocks.length +
                    DeskStocks.length +
                    AccessoryStocks.length
                  }
                  color="error"
                >
                  <DeckIcon />
                </Badge>
              </IconButton>
            ),
            paid: (
              <Checkbox
                checked={paid}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  axios
                    .put(`/quotation/withoutStock/${id}`, {
                      paid: !paid,
                    })
                    .then(() => {
                      getQuotations();
                    })
                    .catch(function (error) {
                      // handle error
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.response.data.message,
                        allowOutsideClick: false,
                      });
                    })
                    .then(function () {
                      // always executed
                    });
                }}
              />
            ),
            quotationNum: (
              <RouterLink to={`/quotation/${id}`} target="_blank">
                {quotationNum}
              </RouterLink>
            ),
            emailIcon: (
              <IconButton
                onClick={() => {
                  setName(restProps.name);
                  setEmail(restProps.email);
                  setEmailOpen(true);
                }}
              >
                <EmailIcon />
              </IconButton>
            ),
            whatsappIcon: (
              <IconButton
                onClick={() => {
                  axios
                    .get("whatsapp/checkauth")
                    .then(() => {
                      setName(restProps.name);
                      setPhone(restProps.phone);
                      setWhatsAppOpen(true);
                    })
                    .catch(function (error) {
                      // handle error
                      axios
                        .get("whatsapp/getqr")
                        .then((response) => {
                          Swal.fire({
                            icon: "info",
                            title:
                              "Please signin with this QRCode and Click the button again.",
                            html: ReactDOMServer.renderToStaticMarkup(
                              <QRCode
                                value={`${response.data.qrcode}`}
                                level="H"
                              />
                            ),
                            allowOutsideClick: false,
                          });
                        })
                        .catch(function (qrerror) {
                          // handle error
                          Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Unable to use WhatsApp Messaging.",
                            allowOutsideClick: false,
                          });
                        })
                        .then(function () {
                          // always executed
                        });
                    })
                    .then(function () {
                      // always executed
                    });
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            ),
            toInvoice: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleToInvoiceClick(index);
                }}
              >
                <DriveFolderUploadIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                component={RouterLink}
                to={{
                  pathname: "/admin/quotation/edit",
                  state: { quotation: quotations[index] },
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
            ...restProps,
          })
        )}
        columns={columns
          .map((column, i) => {
            if (i > 3 && i < 13) {
              if (selectedHideColumns.find((hideColumn) => hideColumn === column.label)              )
                return column;
              else
                return undefined;
            }
            return column;
          })
          .filter((column) => column !== undefined)}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
        onFilterClick={handleFilterClick}
      />
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        maxWidth="sm"
        open={whatsAppOpen}
      >
        <DialogTitle>Send WhatsApp Message to the Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <MuiPhoneNumber
              variant="outlined"
              label="Phone Number"
              onlyCountries={["hk"]}
              defaultCountry={"hk"}
              value={phone}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={whatsAppMessage}
              label="Message"
              fullWidth
              defaultValue={`Hello ${name}.`}
              multiline
              minRows={4}
              maxRows={10}
            // onChange={(e) => {
            //   setWhatsAppMessage(e.target.value);
            // }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setWhatsAppOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleWhatsAppSend}>Send</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        maxWidth="sm"
        open={emailOpen}
      >
        <DialogTitle>Send Email to the Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={emailContent}
              label="Message"
              fullWidth
              defaultValue={`Hello ${name}.`}
              multiline
              minRows={4}
              maxRows={10}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setEmailOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleEmailSend}>Send</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={detailOpen}
        onClose={(event) => {
          event.preventDefault();
          setDetailOpen(false);
        }}
      >
        <DialogTitle>Products Details</DialogTitle>
        <DialogContent>
          <ProductList>
            {quotationIndex < quotations.length &&
              quotations[quotationIndex].ChairStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Chair: ${item.brand}, ${item.model}, ${item.frameColor}, ${item.backColor}, ${item.seatColor}`}
                    secondary={`${item.withHeadrest ? "Headrest, " : ""}${item.withAdArmrest ? "Armrest" : ""
                      }`}
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.ChairToQuotation.unitPrice} HKD`}
                    amount={`Amount: ${item.ChairToQuotation.qty}`}
                    deliveryOption={`${item.ChairToQuotation.deliveryOption}`}
                  />
                </ProductListItem>
              ))}
            {quotationIndex < quotations.length &&
              quotations[quotationIndex].DeskToQuotations.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Desk:
                      ${quotations[quotationIndex].DeskStocks.find(
                      (stock) => stock.id === item.stockId
                    ).supplierCode
                      },
                      ${quotations[quotationIndex].DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).model
                      },
                      ${quotations[quotationIndex].DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).color
                      },
                      ${quotations[quotationIndex].DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).armSize
                      },
                      ${quotations[quotationIndex].DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).feetSize
                      },
                      ${quotations[quotationIndex].DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).beamSize
                      }`}
                    secondary={
                      item.hasDeskTop ? (
                        <span>
                          {`${item.topMaterial},
                            ${item.topColor},
                            ${item.topLength}x${item.topWidth}x${item.topThickness},
                            ${item.topRoundedCorners}-R${item.topCornerRadius},
                            ${item.topHoleCount}-${item.topHoleType} `}
                          <a href={item.topSketchURL} target="_blank" rel="noreferrer">
                            Sketch
                          </a>
                        </span>
                      ) : (
                        "Without DeskTop"
                      )
                    }
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.unitPrice} HKD`}
                    amount={`Amount: ${item.qty}`}
                    deliveryOption={`${item.deliveryOption}`}
                  />
                </ProductListItem>
              ))}
            {quotationIndex < quotations.length &&
              quotations[quotationIndex].AccessoryStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Accessory: ${item.name}`}
                    secondary={`${item.remark}`}
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.AccessoryToQuotation.unitPrice} HKD`}
                    amount={`Amount: ${item.AccessoryToQuotation.qty}`}
                    deliveryOption={`${item.AccessoryToQuotation.deliveryOption}`}
                  />
                </ProductListItem>
              ))}
          </ProductList>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setDetailOpen(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
