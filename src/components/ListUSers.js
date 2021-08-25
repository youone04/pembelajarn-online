import { useEffect, useState } from "react";
import { Modal , Button } from "react-bootstrap";
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

const ListUsers = () => {
  const history = useHistory();
  const [dataUsers, setDataUsers] = useState([]);
  const [lgShow, setLgShow] = useState(false);
  const [nama, setNama] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [idHapus , setIdHapus] = useState(0);


  useEffect(() => {
    const token = localStorage.getItem("dataloginAdmin");
    if (!token) {
      history.push("/login-admin");
    }
    getDataUser();
  }, []);

  const getDataUser = () => {
    const token = localStorage.getItem("dataloginAdmin");
    const dataSend = {
      token,
    };
    fetch(`${process.env.REACT_APP_API}/listUser`, {
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((hasil) => {
        // console.log(hasil)
        if (hasil.status === "berhasil") {
          setDataUsers(hasil.data);
        } else {
          history.push("/login-admin");
        }
      })
      .catch(err =>{
        alert(err)
      });
  };
  const handleSimpan = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("dataloginAdmin");
    const dataSend = {
      nama,
      email,
      password,
      token,
    };
    if(nama=='' || email === '' || password === ''){
      swal('Failed', 'Form Harus disi Semua!', 'error');
      return
    }
    fetch(`${process.env.REACT_APP_API}/tambahUser`,{
      method: 'POST',
      body: JSON.stringify(dataSend),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(res => res.json())
    .then(hasil => {
      console.log(hasil)
      if(hasil.status ==='berhasil'){
        swal('success', 'Data Berhasil Diinputkan', 'success');
        setLgShow(false)
        clearState();
        getDataUser();
      }else{
        history.push("/login-admin");
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  const clearState = () => {
    setNama('');
    setEmail('');
    setPassword('')
  }

  const handleClose = () =>{
    setShow(false)
  }
  const handleHapus = (id) => {
    setShow(true)
    setIdHapus(id);

    

  }

  const handleTrigerHapus =() => {
    const token = localStorage.getItem("dataloginAdmin");
    const sendData = {
        token,
        id_user: idHapus
    }

    fetch(`${process.env.REACT_APP_API}/hapusUser`, {
      method: 'POST',
      body: JSON.stringify(sendData),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then(res => res.json())
    .then(hasil => {
      console.log(hasil)
      if(hasil.status === 'berhasil'){
        swal('Success',hasil.message, 'success');
        setShow(false);
        getDataUser();
      }else{
        history.push("/login-admin");
      }
    })
    .catch(err => {
      alert(err)
    })
  }
  return (
    <>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Large Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group">
              <label htmlFor="nama">Nama</label>
              <input
              onChange={(e) => setNama(e.target.value)}
              value={nama}
                type="text"
                class="form-control"
                id="nama"
                aria-describedby="nama"
                placeholder="nama"
              />
            </div>

            <div class="form-group">
              <label htmlFor="email">email</label>
              <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
                type="email"
                class="form-control"
                id="email"
                aria-describedby="email"
                placeholder="email"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <button onClick={(e) => handleSimpan(e)} class="btn btn-primary">
              SIMPAN
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda Yakin?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
           Cancel
          </Button>
          <Button variant="danger" onClick={handleTrigerHapus}>
           Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 className="text-center pb-5 mb-5 mt-5">List Users</h1>
      <div className="container">
        <button
          onClick={() => setLgShow(true)}
          className="mb-4 btn btn-success rounded"
        >
          + Tambah User
        </button>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama</th>
              <th scope="col">Email</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUsers.map((data, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{data.nama}</td>
                  <td>{data.email}</td>
                  <td>
                    <button onClick={() => handleHapus(data.id_user)} className="btn btn-rounded btn-danger">
                      hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ListUsers;
