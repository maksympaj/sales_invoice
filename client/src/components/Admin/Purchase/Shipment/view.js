import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
// import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";
import DataGrid from "components/Common/DataGrid";
import CheckableMultiSelect from "components/Common/MultiSelect";

const columns = [
    { id: "poNum", label: "P.O. Number" },
    { id: "orderDate", label: "Order Date" },
    { id: "desc", label: "Description" },
    { id: "qty", label: "Qty" },
    { id: "finishDate", label: "Finish Date" },
    { id: "invoice", label: "Invoice#" },
    { id: "orderQty", label: "Order Qty" },
    { id: "location", label: "Location" },
    { id: "supplier", label: "Supplier" },
    { id: "beam", label: "BEAM" },
    { id: "akNum", label: "AK#" },
    { id: "heworkNum", label: "Hework#" },
    { id: "remark", label: "Remark" },
    { id: "edit", nonSort: true, sx: { maxWidth: 45, width: 45 } },
    { id: "delete", nonSort: true, sx: { maxWidth: 45, width: 45 } },
];

const defaultHiddenColumns = [
    "Invoice",
    "Order Qty",
    "Location",
    "Supplier",
    "BEAM",
    "AK#",
    "Hework#",
    "Remark",     
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
//   const theme = useTheme();

    const [shipments, setShipments] = useState([]);
    const [initShipments, setInitShipments] = useState([]);
    const [columnsToShow, setColumnsToShow] = useState([]);
    const [searchPONumber, setsearchPONumber] = useState("");
    const [filterAnchor, setFilterAnchor] = useState(null);

    const onHideColumnChanged = (values) => {
        setColumnsToShow(values);
    };

    const handleFilterClick = (e) => {
        e.preventDefault();
        if (filterAnchor === null) setFilterAnchor(e.currentTarget);
        else setFilterAnchor(null);
    };

    const handleRemoveClick = (index) => {
    if (index < shipments.length && index >= 0) {
        Swal.fire({
        title: "Are you sure?",
        text: "This action will remove current purchase permanently.",
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
            });
        }
        });
    }
    };

    const handleBulkRemoveClick = (selected) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action will remove selected shipments permanently.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Remove!",
            cancelButtonText: "No, Keep Them.",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
            axios
                .delete("/shipments", {
                data: { ids: selected },
                })
                .then((response) => {
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
    };

    const getShipments = (cancelToken) => {
        axios.get("/shipment", { cancelToken })
        .then((response) => {
            let shipments = [];
            response.data.map(item => {
                let shipment = item;
            //   order.isSentToShipment = false;
            //   if (order.AccessoryToOrders.length !== 0 && order.AccessoryToOrders[0].shipmentId != null)
            //     order.isSentToShipment = true;
            //   if (order.ChairToOrders.length !== 0 && order.ChairToOrders[0].shipmentId != null)
            //     order.isSentToShipment = true;
            //   if (order.DeskToOrders.length !== 0 && order.DeskToOrders[0].shipmentId != null)
            //     order.isSentToShipment = true;

                shipments.push(shipment);
                return shipment;
            });

            setShipments(shipments);
            setInitShipments(shipments);
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
            const searchedShipments = initShipments
            .filter((shipment) =>
                shipment.poNum
                    .toString()
                    .toLowerCase()
                    .includes(searchPONumber.toLowerCase())
            )
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
                label="P.O. Number"
                variant="outlined"
                onKeyPress={onKeyPressed}
                value={searchPONumber}
                onChange={(e) => setsearchPONumber(e.target.value)}
            />
            </Paper>
            <CheckableMultiSelect
                options={defaultHiddenColumns}
                onChange={onHideColumnChanged}
                selected={columnsToShow}
            />
            <DataGrid
                title="Shipments"
                rows={shipments.map((
                        {
                            id,
                            poNum,
                            des,
                            qty,
                            orderQty,
                            orderDate,
                            finishDate,
                            location,
                            supplier,
                            invoice,
                            remark,
                            ...restProps
                        },
                        index
                    ) => ({
                        id,
                        index,
                        poNum: poNum,
                        desc: des,
                        qty: qty,
                        orderQty: orderQty,
                        orderDate: orderDate,
                        finishDate: finishDate,
                        location: location,
                        supplier: supplier,
                        invoice: invoice,
                        remark: remark,
                        edit: (
                            <IconButton
                                component={RouterLink}
                                to={{
                                    pathname: "/admin/shipment/edit",
                                    state: { shipment: shipments[index] },
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
                columns={columns.map((column, i) => {
                        if (i > 4 && i < 13) {
                            if (columnsToShow.find((col) => col === column.label))
                                return column;
                            else
                                return undefined;
                        }
                        return column;
                    })
                    .filter((column) => column !== undefined)
                }
                onRemoveClick={handleRemoveClick}
                onBulkRemoveClick={handleBulkRemoveClick}
                onFilterClick={handleFilterClick}
            />
        </Box>
    );
});
