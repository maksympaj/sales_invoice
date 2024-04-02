import React, { useEffect, useState } from 'react';
import Detail from './detail';
import { Redirect, useLocation } from 'react-router-dom';
import axios from "axios";

const Edit = (props) => {
  const loc = useLocation();
  const { shipment } = loc.state || {};
  const {
    id,
    supplier,
    location,
    remark,
  } = shipment || {};

  return shipment ? (
    <Detail
      componentType="edit"
      initialShipment={{
        id: id,
        supplier: supplier,
        location: location,
        remark: remark,
      }}
      initialCart={{}}
      {...props}
    />
  ) : (
    <Redirect to="/admin/purchase/shipment" />
  );
};

export default Edit;
