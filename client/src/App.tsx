// import ExpenseIndex from './components/expense'
import Home from './components/home'
import SideBar from './components/sidebar/sidebar'

function App() {

  window.location.href = '/properties';
  return (
    <SideBar>
      <Home/>
    </SideBar>
  )
}

export default App
