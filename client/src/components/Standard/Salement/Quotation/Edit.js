import React, { useState } from 'react';
import Detail from './Detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const location = useLocation();
  const { quotation } = location.state || {};
  const {
    ChairStocks,
    DeskStocks,
    DeskToQuotations,
    AccessoryStocks,
    ServiceToQuotations,
    Seller,
    sellerId,
    remark,
    ...client
  } = quotation || {};

  const [phone, setPhone] = useState(client.phone);

  return quotation ? (
    <Detail
      componentType="edit"
      initialClient={{
        ...client,
        phone,
        setPhone,
      }}
      initialCart={ChairStocks.map(({ ChairToQuotation, ...restProps }) => ({
        productType: 'chair',
        productDetail: restProps,
        remark: ChairToQuotation.remark,
        productPrice: ChairToQuotation.unitPrice,
        productAmount: ChairToQuotation.qty,
        productDeliveryOption: ChairToQuotation.deliveryOption,
      }))
        .concat(
          DeskToQuotations.map((DeskToQuotation) => {
            const {
              stockId,
              unitPrice,
              qty,
              deliveryOption,
              ...deskTopProps
            } = DeskToQuotation;

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
          AccessoryStocks.map(({ AccessoryToQuotation, ...restProps }) => ({
            productType: 'accessory',
            productDetail: restProps,
            remark: AccessoryToQuotation.remark,
            productPrice: AccessoryToQuotation.unitPrice,
            productAmount: AccessoryToQuotation.qty,
            productDeliveryOption: AccessoryToQuotation.deliveryOption,
          }))
        )}
      initialServices = {ServiceToQuotations}
      {...props}
    />
  ) : (
    <Redirect to="/user/quotation" />
  );
};

export default Edit;
