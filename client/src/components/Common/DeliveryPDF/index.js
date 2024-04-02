import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(() => {
  const { productType, deliveryId } = useParams();
  const [link, setLink] = useState('');
  useEffect(() => {
    if (!link) {
      axios
        .post('/delivery/generatePDF', {
          productType,
          deliveryId,
          signature: '',
        })
        .then((response) => {
          // handle success
          if (!response.data) {
            Swal.fire({
              icon: 'info',
              title: 'Alarm',
              text:
                'New Delivery PDF was created. Please click the button again to check.',
              allowOutsideClick: false,
            });
          }
          setLink(response.data.url);
          if (response.data.url) window.location.href = response.data.url;
        })
        .catch(function (error) {
          // handle error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
            allowOutsideClick: false,
          });
        });
    }
  }, [link]);
  return <></>;
});
