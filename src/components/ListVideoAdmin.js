import { useEffect, useState } from "react";
import {Modal, Button} from 'react-bootstrap'
import ReactPlayer from "react-player/lazy";
import swal from 'sweetalert';
import { useHistory,Link } from 'react-router-dom';


const ListVideoAdmin = () => {
  const history = useHistory();
  const [dataListVideo, setDataListVideo] = useState([]);
  const [hanldeShowVideo , setHandleShowVideo] = useState(false);
  const [linkVideo , setLinkVideo] = useState('');
  const [lgShow, setLgShow] = useState(false);
  const [judul , setJudul] = useState('');
  const [keterangan , setKeterangan] = useState('');
  const [linkThumbnail ,setThumbnail] = useState('');
  const [linkVideoUpload , setLinkVideoUpload] = useState('');
  const [show , setShowDelete] = useState(false);
  const [idDel , setIdDel] = useState('');
  const [showEdit , setShowEdit] = useState(false);
  const [idUpdate , setIdUpdate] = useState('');


  const handleClose =  () => {
    setHandleShowVideo(false)
    setShowDelete(false)
  }

  const handleShow = (id) => {
    setShowDelete(true)
    setIdDel(id)
  }
  console.log(idDel)

  useEffect(() => {
    const login = localStorage.getItem('dataloginAdmin');
    if(!login){
      history.push('/login-admin')
    }
    getData();
  }, []);

  const getData = () => {
    const token = localStorage.getItem("dataloginAdmin");
    const senData = {
      token,
    };
    fetch(`${process.env.REACT_APP_API}/listKonten`, {
      method: "POST",
      body: JSON.stringify(senData),
      headers: {
        "Content-Type": "applicatio/json",
      },
    })
      .then((res) => res.json())
      .then((hasil) => {
        console.log('data', hasil)
       if(hasil.status === 'berhasil'){
        setDataListVideo(hasil.data);
       }else{
        history.push('/login-admin');
        localStorage.removeItem('dataloginAdmin')
       }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleOpenVideo = (data)=>{
    setHandleShowVideo(true)
    setLinkVideo(data.link_video)
  }
  const handleSimpan = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('dataloginAdmin');
    const dataSend = {
      judul: judul,
      keterangan : keterangan,
      link_thumbnail: linkThumbnail,
      link_video :linkVideoUpload,
      token: token
    }
    if(judul === '' ||
    keterangan==='' ||
    linkVideoUpload===''||
    linkThumbnail===''){
      swal('Gagal', 'Form Harus Terisi Semua!', 'error')
      return ;
    }
    fetch(`${process.env.REACT_APP_API}/tambahKonten`,{
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then(res => res.json())
    .then(hasil => {
      console.log('hasil =>', hasil);
      setLgShow(false)
      if(hasil.status === 'berhasil'){
        clearState()
        swal("success", hasil.message, "success")
        getData()
      }else{
        swal("failed", hasil.message.judul[0], "error")
      }
    
    })
  }

  const clearState = () => {
    setJudul('');
    setKeterangan('');
    setThumbnail('');
    setLinkVideoUpload('')
  }
  const handleDelte = () => {
    const token = localStorage.getItem('dataloginAdmin');
    const dataSend = {
      id_konten: idDel,
      token: token
    }
    fetch(`${process.env.REACT_APP_API}/hapusKonten`,{
      method: 'POST',
      body: JSON.stringify(dataSend),
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(res => res.json())
    .then(hasil => {
      getData();
      setShowDelete(false);
      swal('success',hasil.message,'success')
    })
    .catch(err => {
      alert(err)
    })
  }

  const handleShowUpdate = (data) => {
    setShowEdit(true)
    setIdUpdate(data.id_konten)
   setJudul(data.judul);
   setKeterangan(data.keterangan);
   setThumbnail(data.link_thumbnail);
   setLinkVideoUpload(data.link_video)
  }

  const handleUpateSimpan = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('dataloginAdmin');
    const dataSend = {
      id_konten : idUpdate,
      judul: judul,
      keterangan : keterangan,
      link_thumbnail: linkThumbnail,
      link_video :linkVideoUpload,
      token: token
    }

    fetch(`${process.env.REACT_APP_API}/ubahKonten`,{
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(res => res.json())
    .then(hasil => {
      console.log(hasil)
        if(hasil.status === 'berhasil'){
          getData();
          clearState();
          setShowEdit(false)
          swal('success' , hasil.message, 'success');
        }else{
          clearState();
          swal('failed' , 'gagal update!', 'error');
        }
      
    })
    .catch(err => {
      clearState();
      alert(err)
    })
  }

  const logOut=  () => {
   localStorage.removeItem('dataloginAdmin');
   history.push('/login-admin')
  }
  return (
    <>
      {/* modal play */}
      <Modal
        show={hanldeShowVideo}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="h-auto">
         {
             <>
             <ReactPlayer
             pip={true}
             config={{
                 youtube:{
                     playerVars:{
                         showinfo: 1,
                         origin: window.location.origin,

                     },
                 },
             }}
             width="100%"
             height= "300px"
             controls={true}
             url={`${linkVideo}`}


            />

             </>
         }
         </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>

      {/* modal tambah video */}
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
            <div className="form-group">
              <label htmlFor="judul">Judul</label>
              <input
              onChange={(e) => setJudul(e.target.value)}
              value={judul}
              type="text"
              className="form-control"
              id="judul"
              placeholder="judul"
              />
            </div>

            <div className="form-group">
              <label htmlFor="keterangan">keterangan</label>
              <input
              onChange={(e) => setKeterangan(e.target.value)}
              value={keterangan}
              type="text"
              className="form-control"
              id="keterangan"
              placeholder="keterangan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link thumbnail">link thumbnail</label>
              <input
              onChange={(e) => setThumbnail(e.target.value)}
              value={linkThumbnail}
              type="text"
              className="form-control"
              id="link thumbnail"
              placeholder="link thumbnail"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link video">link video</label>
              <input
              onChange={(e) => setLinkVideoUpload(e.target.value)}
              value={linkVideoUpload}
              type="text"
              className="form-control"
              id="link video"
              placeholder="link video"
              />
            </div>
            <button onClick={(e) => handleSimpan(e)} className="btn btn-primary">SIMPAN</button>
          </form>
        </Modal.Body>
      </Modal>
        {/* modal delete */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button variant="danger" onClick={handleDelte}>
            DELETE
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* modal edit */}
      <Modal
        size="lg"
        show={showEdit}
        onHide={() => setShowEdit(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Large Modal EDIT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="judul">Judul</label>
              <input
              onChange={(e) => setJudul(e.target.value)}
              value={judul}
              type="text"
              className="form-control"
              id="judul"
              placeholder="judul"
              />
            </div>

            <div className="form-group">
              <label htmlFor="keterangan">keterangan</label>
              <input
              onChange={(e) => setKeterangan(e.target.value)}
              value={keterangan}
              type="text"
              className="form-control"
              id="keterangan"
              placeholder="keterangan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link thumbnail">link thumbnail</label>
              <input
              onChange={(e) => setThumbnail(e.target.value)}
              value={linkThumbnail}
              type="text"
              className="form-control"
              id="link thumbnail"
              placeholder="link thumbnail"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link video">link video</label>
              <input
              onChange={(e) => setLinkVideoUpload(e.target.value)}
              value={linkVideoUpload}
              type="text"
              className="form-control"
              id="link video"
              placeholder="link video"
              />
            </div>
            <button onClick={(e) => handleUpateSimpan(e)} className="btn btn-primary">SIMPAN</button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="jumbotron">
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </p>
        <hr className="my-4" />
        <p>
          It uses utility classNamees for typography and spacing to space
          content out within the larger container.
        </p>
        <button onClick={() => setLgShow(true)} className="btn btn-primary btn-lg"  role="button">
          + Tambah Video
        </button>
        <Link to="/list-users" className="btn btn-success btn-lg ml-3"  role="button">
          Users
        </Link>

        <button onClick={() => logOut()} className="btn btn-danger btn-lg ml-3"  role="button">
         LOGOUT
        </button>
      </div>

      <div className="row justify-content-center">
        {dataListVideo?dataListVideo.map((data, index) => {
          return (
            <div
              key={index}
              className="card m-3 col-md-4 col-lg-3 "
              style={{ width: "18rem", height: "auto", border: "none" }}
            >
              <img
                onClick={() => handleOpenVideo(data)}
                src={data.link_thumbnail}
                className="card-img-top"
                alt="..."
                style={{ width: "100%" }}
              />
              <div className="card-body">
                <h5 className="card-title">{data.judul}</h5>
                <p className="card-text">{data.keterangan}</p>
                <button onClick={() => handleShow(data.id_konten) }  className="btn btn-danger mr-3">
                 DELETE
                </button>
                <button onClick={() => handleShowUpdate(data) }  className="btn btn-success mr-3">
                 EDIT
                </button>
              </div>
            </div>
          );
        }):''}
      </div>
    </>
  );
};

export default ListVideoAdmin;
