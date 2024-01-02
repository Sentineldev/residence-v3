/* @refresh reload */
import { render } from 'solid-js/web'

// import App from './App'
import './index.css'
import App from './App'
// import { Router, Route } from '@solidjs/router'
import { Router, Route } from "@solidjs/router";
import ExpenseIndex from './components/expense';
import PropertyIndex from './components/property';
import DetailPropertyIndex from './components/property/detail/detail-index';
import RegisterCharge from './components/property/transaction/register';

const root = document.getElementById('root')

render(() => (
    <Router>
        <Route path='/' component={App} />
        <Route path='/expenses' component={ExpenseIndex} />
        <Route path={`/properties`}>
            <Route path='' component={PropertyIndex}/>
            <Route path='/:symbol' component={DetailPropertyIndex}/>
            <Route path='transaction/:type' component={RegisterCharge}/>
        </Route>
    </Router>
), root!)
