import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Tabs,
    Tab
} from "@mui/material";
import { StockTab } from "./StockTab";
import axios from "axios";

export const CreatePurchaseOrder = () => {
    const [stocksIndex, setStocksIndex] = useState(0);
    const [chairStocks, setChairStocks] = useState([]);
    const [deskStocks, setDeskStocks] = useState([]);
    const [accessoryStocks, setAccessoryStocks] = useState([]);
    const [chairOrders, setChairOrders] = useState([]);
    const [deskOrders, setDeskOrders] = useState([]);
    const [accessoryOrders, setAccessoryOrders] = useState([]);

    const getProductsOrdered = (cancelToken) => {
        axios
            .get("/shipment/products", { cancelToken })
            .then((response) => {
                console.log(response.data);
                const chairs = response.data.chairs;
                setChairOrders(chairs);
                const desks = response.data.desks;
                setDeskOrders(desks);
                const accessories = response.data.accessories;
                setAccessoryOrders(accessories);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    const getChairStocks = (cancelToken) => {
        axios
            .get(`/chairStock`, { cancelToken })
            .then((response) => {
                setChairStocks(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const getDeskStocks = (cancelToken) => {
        axios
            .get(`/deskStock/get_order_joined`, { cancelToken })
            .then((response) => {
                setDeskStocks(response.data[0]);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const getAccessoryStocks = (cancelToken) => {
        axios
            .get(`/accessoryStock`, { cancelToken })
            .then((response) => {
                setAccessoryStocks(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    useEffect(() => {
        const source = axios.CancelToken.source();
        getChairStocks(source.token);
        getDeskStocks(source.token);
        getAccessoryStocks(source.token);
        getProductsOrdered(source.token);
        return () => source.cancel("Stock Component got unmounted");
    }, []);

    return (
        <div>
            <Paper sx={{ my: "10px", mx: "10px" }}>
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
                        {/* <Tab label="Miscs" /> */}
                    </Tabs>
                    <StockTab
                        stocksIndex={stocksIndex}
                        index={0}
                        title={"Chair Stocks"}
                        stocks={chairStocks}
                        chairOrders={chairOrders}
                        deskOrders={deskOrders}
                        accessoryOrders={accessoryOrders}
                        setChairOrders={setChairOrders}
                        setDeskOrders={setDeskOrders}
                        setAccessoryOrders={setAccessoryOrders}
                    />
                    <StockTab
                        stocksIndex={stocksIndex}
                        index={1}
                        title={"Desk Stocks"}
                        stocks={deskStocks}
                        chairOrders={chairOrders}
                        deskOrders={deskOrders}
                        accessoryOrders={accessoryOrders}
                        setChairOrders={setChairOrders}
                        setDeskOrders={setDeskOrders}
                        setAccessoryOrders={setAccessoryOrders}
                    />
                    <StockTab
                        stocksIndex={stocksIndex}
                        index={2}
                        title={"Accessory Stocks"}
                        stocks={accessoryStocks}
                        chairOrders={chairOrders}
                        deskOrders={deskOrders}
                        accessoryOrders={accessoryOrders}
                        setChairOrders={setChairOrders}
                        setDeskOrders={setDeskOrders}
                        setAccessoryOrders={setAccessoryOrders}
                    />
                </Box>
            </Paper>
        </div>
    )
};