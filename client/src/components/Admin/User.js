import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'firstName',
    label: 'First Name',
  },
  {
    id: 'lastName',
    label: 'Last Name',
  },
  {
    id: 'type',
    label: 'Type',
  },
  {
    id: 'prefix',
    label: 'Prefix',
  },
  {
    id: 'isActive',
    label: 'Active',
  },
  {
    nonSort: true,
    id: 'edit',
    sx: { maxWidth: 45, width: 45 },
  },
  {
    nonSort: true,
    id: 'delete',
    sx: { maxWidth: 45, width: 45 },
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const [users, setUsers] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const [id, setID] = useState('');
  const [formProps, setFormProps] = useState([]);
  const [type, setType] = useState('');

  const handleEditClick = (index) => {
    if (index < users.length && index >= 0) {
      setID(users[index].id);
      setFormProps([
        {
          name: 'email',
          defaultValue: users[index].email,
          label: 'Email',
          width: '100%',
        },
        {
          name: 'firstName',
          defaultValue: users[index].firstName,
          label: 'First Name',
          width: '100%',
        },
        {
          name: 'lastName',
          defaultValue: users[index].lastName,
          label: 'Last Name',
          width: '100%',
        },
        {
          name: 'prefix',
          defaultValue: users[index].prefix,
          label: 'Prefix',
          width: '100%',
        },
      ]);
      setType(users[index].type);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (index) => {
    if (index < users.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current account permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep this account.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/user/${users[index].id}`)
            .then((response) => {
              // handle success
              getUsers();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: 'error',
                title: 'Error',
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
      title: 'Are you sure?',
      text: 'This action will remove selected ChairColors permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/user', { data: { ids: selected } })
          .then((response) => {
            // handle success
            getUsers();
          })
          .catch(function (error) {
            // handle error
            Swal.fire({
              icon: 'error',
              title: 'Error',
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

  const handleClose = () => {
    setEditOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    new axios.put(`/user/${id}`, {
      email: data.get('email'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      type: type,
      prefix: data.get('prefix'),
    })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getUsers();
      })
      .catch(function (error) {
        // handle error
        setEditOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEditOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getUsers = (cancelToken) => {
    axios
      .get('/user', { cancelToken: cancelToken })
      .then((response) => {
        // handle success
        setUsers(response.data);
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
    let source = axios.CancelToken.source();
    getUsers(source.token);
    return () => source.cancel('Users Component got unmounted');
  }, []);

  return (
    <>
      <DataGrid
        title="Users"
        rows={users.map(({ isActive, ...restProps }, index) => ({
          index,
          isActive: (
            <Checkbox
              checked={isActive}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                axios
                  .put(`/user/${restProps.id}`, {
                    isActive: !isActive,
                  })
                  .then(() => {
                    getUsers();
                  })
                  .catch(function (error) {
                    // handle error
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
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
          edit: (
            <IconButton
              onClick={(event) => {
                event.preventDefault();
                handleEditClick(index);
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
        }))}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      />
      <Dialog
        open={editOpen}
        PaperProps={{ component: 'form', onSubmit: handleSave }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Please Edit the User information and Click Save button.
            </DialogContentText>
            {formProps.map(({ width, ...restProps }, index) => (
              <TextField
                key={index}
                sx={{ flexBasis: width, minWidth: width }}
                {...restProps}
              />
            ))}
            <FormControl>
              <InputLabel id="user-type-select-label" size="small">
                Type
              </InputLabel>
              <Select
                labelId="user-type-select-label"
                id="user-type-select"
                value={type}
                label="Type"
                onChange={(event) => {
                  event.preventDefault();
                  setType(event.target.value);
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="salesman">Salesman</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
