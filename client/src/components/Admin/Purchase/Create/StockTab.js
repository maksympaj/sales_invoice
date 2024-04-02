import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Paper,
    Autocomplete,
    TextField
} from "@mui/material";
import DataGrid from "../../../Common/DataGrid";
import CheckableMultiSelect from "../../../Common/MultiSelect";
import Swal from "sweetalert2";
import { columns, deskColumns, accessoryColumns, deskHideColumns } from "./columns.js";

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

export const StockTab = ({
    title, stocks, stocksIndex,
    index,
    chairOrders,
    deskOrders,
    accessoryOrders,
    setChairOrders,
    setDeskOrders,
    setAccessoryOrders
}) => {

    const [features, setFeatures] = useState([]);
    const [filterBrand, setFilterBrand] = useState(null);
    const [filterModel, setFilterModel] = useState(null);
    const [selectedHideColumns, setSelectedHideColumns] = useState([]);

    const arrayContainStock = (items, stockId) => {
        return items.filter((item) => item.stockId === stockId).length !== 0;
    }

    const getItemFromStocks = (items, stockId) => {
        let items_ = [];
        if (index !== 1)
            items_ = items.filter((item) => item.stockId === stockId);
        else {
            items_ = items.filter((item) => item.orderId === stockId);
        }

        if (items_.length === 0)
            return null;

        return items_[0];
    }

    const getOrdersInTypes = () => {
        return index === 0 ? chairOrders : index === 1 ? deskOrders : accessoryOrders;
    }

    const getSetOrdersInTypes = () => {
        return index === 0 ? setChairOrders : index === 1 ? setDeskOrders : setAccessoryOrders;
    }

    const orderContainStock = (stockId) => {
        if (arrayContainStock(getOrdersInTypes(), stockId))
            return true;
        return false;
    }

    const getStockQtyToOrder = (stockId) => {
        let item = getItemFromStocks(getOrdersInTypes(), stockId);
        if (item === null)
            return 0;
        return item.orderedQty;
    }

    const updateOrders = (stockId, qty) => {
        let item = getItemFromStocks(getOrdersInTypes(), stockId);
        let newItems = [];

        if (item == null && qty === 0) {
            return;
        } else if (item == null) {
            newItems = [...getOrdersInTypes(), { stockId: stockId, orderedQty: qty }]
        } else {
            newItems = getOrdersInTypes().map(item => {
                if (item.stockId !== stockId)
                    return item;
                return { ...item, orderedQty: qty };
            });
        }

        getSetOrdersInTypes()(newItems);
    }

    return (
        <TabPanel value={stocksIndex} index={index}>
            <Paper
                sx={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    // display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    display: "none"
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
                            .filter(
                                (item) =>
                                    !filterBrand || item.brand === filterBrand
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
                options={deskHideColumns}
                onChange={setSelectedHideColumns}
                selected={selectedHideColumns}
            />
            <DataGrid
                nonSelect={true}
                title={title}
                rows={stocks
                    .map(
                        (
                            {
                                id,
                                orderId,
                                thumbnailURL,
                                withHeadrest,
                                withAdArmrest,
                                qtyToOrder,
                                ...restProps
                            }
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
                            bkColor: orderContainStock(id) ? 1 : 0,
                            withHeadrest: withHeadrest ? "Yes" : "No",
                            withAdArmrest: withAdArmrest ? "Yes" : "No",
                            ...restProps,
                            qtyToOrder: (
                                <TextField
                                    label={"QtyToOrder"}
                                    value={index === 1 ? getStockQtyToOrder(orderId) : getStockQtyToOrder(id)}
                                    onChange={(e) => updateOrders(id, e.target.value)}
                                />
                            )
                        })
                    )
                    .filter(
                        (item) =>
                            (!filterBrand || item.brand === filterBrand) &&
                            (!filterModel || item.model === filterModel)
                    )}
                columns={(index === 0 ? columns : index === 1 ? deskColumns : accessoryColumns)
                    .map((column, i) => {
                        if (i > 5) {
                            if (
                                selectedHideColumns.find(
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
    );
}