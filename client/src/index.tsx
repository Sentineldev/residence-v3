/* @refresh reload */
import { render } from 'solid-js/web'

// import App from './App'
import './index.css'
import App from './App'
// import { Router, Route } from '@solidjs/router'
import { Router, Route } from "@solidjs/router";
import ExpenseIndex from './components/expense';

const root = document.getElementById('root')

render(() => (
    <Router>
        <Route path='/' component={App} />
        <Route path='/expenses' component={ExpenseIndex} />
    </Router>
), root!)
