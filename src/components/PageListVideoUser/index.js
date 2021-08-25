



import { useEffect, useState } from "react";
import {Modal, Button} from 'react-bootstrap'
import ReactPlayer from "react-player/lazy";
import { useHistory,Link } from 'react-router-dom';


const PageListVidoUser = () => {
  const history = useHistory();
  const [dataListVideo, setDataListVideo] = useState([]);
  const [hanldeShowVideo , setHandleShowVideo] = useState(false);
  const [linkVideo , setLinkVideo] = useState('');
  const [search , setSearch] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('loginUser');

    if(!token){
      history.replace('/')
      return
    }
   
    const dataSend = {
      cari: search,
      token,
    }

    fetch(`${process.env.REACT_APP_API}/cariKontenPublic`,{
      method: 'POST',
      body: JSON.stringify(dataSend),
      headers: {
        "Content-Type" : 'application/json'
      }
    })
    .then((res) =>res.json())
    .then(hasil => {
      if(hasil.status === 'gagal'){{
        localStorage.removeItem('loginUser');
        history.replace('/')
        return
      }}
      setDataListVideo(hasil.data)
    })
    .catch(err => {
      alert(' =>>>>',err)
      // console.lof(err)
    })
  },[search])

  const handleClose =  () => {
    setHandleShowVideo(false)
  }

  const handleOpenVideo = (data) => {
    setHandleShowVideo(true)
    setLinkVideo(data.link_video)
  }

  useEffect(() => {
    const login = localStorage.getItem('loginUser');
    if(!login){
      history.push('/')
      return
    }
    getData();
  }, []);

  const getData = () => {
    const token = localStorage.getItem("loginUser");
    const senData = {
      token,
    };
    fetch(`${process.env.REACT_APP_API}/listKontenPublic`, {
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
        history.push('/');
        localStorage.removeItem('loginUser')
        return
       }
      })
      .catch((err) => {
        alert(err);
      });
  };



  



  const logOut=  () => {
   localStorage.removeItem('loginUser');
   history.push('/')
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
          <Modal.Title>Video</Modal.Title>
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
        </Modal.Footer>
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

        <button onClick={() => logOut()} className="btn btn-danger btn-lg ml-3"  role="button">
         LOGOUT
        </button>

        <Link to="/quiz" className="btn btn-primary bnt-lg m-2">
            SOAL
        </Link>

         <form className="form-inline">
           <input style={{marginLeft:'auto'}} onChange={(e) => setSearch(e.target.value)} className="form-control mr-sm-2" type="search" placeholder="Search" />
         </form>
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
              </div>
            </div>
          );
        }):''}
      </div>
    </>
  );
};

export default PageListVidoUser;
