import React, { useState } from 'react';
import Detail from './Detail';

const Create = (props) => {
  const [phone, setPhone] = useState('');
  return (
    <Detail
      componentType="create"
      initialClient={{
        phone,
        setPhone,
        paid: true,
        discountType: 1,
        surchargeType: 1,
        validTil: 1,
        remark: '',
      }}
      initialCart={[]}
      {...props}
    />
  );
};

export default Create;
