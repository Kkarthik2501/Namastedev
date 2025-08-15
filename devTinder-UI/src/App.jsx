import { Profiler } from "react"
import Body from "./components/Body"
import NavBar from "./components/NavBar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import Connections from "./components/Connections"
import Request from "./components/Request"
import { ToastContainer } from 'react-toastify';
function App() {


  return (
    <>
      {/* will make the store available all over the application */}
      <Provider store={appStore}>
        <ToastContainer />
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body />} > // child routes will be rendered in outlet
              <Route path='feed' element={<Feed />} />
              <Route path='login' element={<Login />} />
              <Route path='profile' element={<Profile />} />
              <Route path='connections' element={<Connections />} />
              <Route path='requests' element={<Request />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>

    </>
  )
}

export default App
