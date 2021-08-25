import {BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import App from './App';
import LoginUser from './components/AuthUsers/Login';
import ListUsers from './components/ListUSers';
import ListVideoAdmin from './components/ListVideoAdmin';
import Login from './components/Login';
import Regsitrasi from './components/AuthUsers/Registrasi';
import ListVideoUser from './components/PageListVideoUser';
import SoalQuiz from './components/SoalQuiz';
import Skor from './components/Skor/Skor';

const Middleware = () => {
    return(
        <Router>
            <Switch>
                <Route exact path="/" render={() => <LoginUser/>} />
                <Route exact path="/login-admin" render={() => <Login/>} />
                <Route exact path="/list-video-admin" render={()=> <ListVideoAdmin/>} />
                <Route exact path="/list-users" render={()=> <ListUsers/>} />
                <Route exact path="/registrasi-user" render={()=> <Regsitrasi/>} />
                <Route exact path="/list-video-user" render={()=> <ListVideoUser/>} />
                <Route exact path="/quiz" render={()=> <SoalQuiz/>} />
                <Route exact path="/skor" render={()=> <Skor/>} />
            </Switch>
        </Router>
    )
}
export default Middleware;