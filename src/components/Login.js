import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const Login = () =>{
    const history = useHistory()
const [email , setEmail] = useState('');
const [password , setPassword] = useState('');

useEffect(() => {
    const login = localStorage.getItem('dataloginAdmin');
    if(login){
        history.push('/list-video-admin');
    }

},[]);



const handleSubmit = (e) => {
    e.preventDefault();
    const dataSend = {
        email,
        password
    }
    if(email==='' || password===''){
       swal("Failed", "Login Gagal", "error")
    }else{
        fetch(`${process.env.REACT_APP_API}/loginUser`,{
            method:'POST',
            body: JSON.stringify(dataSend),
            headers:{
                'Content-Type' : 'applicatio/json'
            }

        })
        .then(res => res.json())
        .then(hasil => {
            console.log(hasil)
            if(hasil.status === 'berhasil'){
                localStorage.setItem('dataloginAdmin',hasil.token);
                history.push('/list-video-admin')
            }
        })
        .catch(err => {
            alert(err)
        })
    }

}

    return(
        <>
        <div className="container image-bg">
            <div className="d-flex justify-content-center h-100">
             <div className="card">
                 <div className="card-header">
                     <h3>Login Admin</h3>
                     <div className="d-flex justify-content-end social-icon">
                         <span>
                             <i className="fab fa-facebook-square"></i>
                         </span>
                         <span>
                             <i className="fab fa-google-plus-square"></i>
                         </span>
                         <span>
                             <i className="fab fa-twitter-square"></i>
                         </span>
                     </div>
                 </div>

                 <div className="card-body">
                     <form>
                         <div className="input-group form-group">
                             <div className="input-group-prepend">
                                 <span className="input-group-text">
                                     <i className="fas fa-user"></i>
                                 </span>
                             </div>
                             <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="email"/>
                         </div>

                         <div className="input-group form-group">
                             <div className="input-group-prepend">
                                 <span className="input-group-text">
                                     <i className="fas fa-key"></i>
                                 </span>
                             </div>
                             <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="password"/>
                         </div>

                         <div className="form-group">
                             <button onClick={(e) => handleSubmit(e)} className="btn float-right login_btn">LOGIN</button>
                         </div>
                     </form>
                 </div>
             </div>
            </div>
        </div>
        </>
    )
}
export default Login;