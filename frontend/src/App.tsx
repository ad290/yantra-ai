import { RouterProvider } from 'react-router-dom';
import { Router } from './app.routes';

const App = () => { 
  return (
    <RouterProvider router={Router} />
  )
}

export default App;