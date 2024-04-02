import React, { useState } from 'react';
import Detail from './Detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const location = useLocation();
  const { order } = location.state || {};
  const {
    ChairStocks,
    DeskStocks,
    DeskToOrders,
    AccessoryStocks,
    ServiceToOrders,
    Seller,
    sellerId,
    ...client
  } = order || {};

  const [phone, setPhone] = useState(client.phone);

  return order ? (
    <Detail
      componentType="edit"
      initialClient={{
        ...client,
        phone,
        setPhone,
      }}
      initialCart = {ChairStocks.map(({ ChairToOrder, ...restProps }) => ({
        productType: 'chair',
        productDetail: {
          ...restProps,
        },
        remark: ChairToOrder.remark,
        productPrice: ChairToOrder.unitPrice,
        productAmount: ChairToOrder.qty,
        productDeliveryOption: ChairToOrder.deliveryOption,
      }))
        .concat(
          DeskToOrders.map((DeskToOrder) => {
            const {
              stockId,
              unitPrice,
              qty,
              deliveryOption,
              ...deskTopProps
            } = DeskToOrder;
  
            const stock = DeskStocks.find(function(val) {
              return val.id === stockId
            })
  
            return {
              productType: 'desk',
              productDetail: stock,
              productPrice: unitPrice,
              productAmount: qty,
              productDeliveryOption: deliveryOption,
              ...deskTopProps,
            };
          })
        )
        .concat(
          AccessoryStocks.map(({ AccessoryToOrder, ...restProps }) => ({
            productType: 'accessory',
            productDetail: {
              ...restProps,
            },
            remark: AccessoryToOrder.remark,
            productPrice: AccessoryToOrder.unitPrice,
            productAmount: AccessoryToOrder.qty,
            productDeliveryOption: AccessoryToOrder.deliveryOption
          }))
        )}
      initialServices = {ServiceToOrders}
      {...props}
    />
  ) : (
    <Redirect to="/user/sales" />
  );
};

export default Edit;
