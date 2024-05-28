import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';

import Profile from './pages/Profile';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import { UsersDahboard } from './pages/Users/UsersDashboard';
import Login from './pages/Users/LoginInterface';
import CreateTaskForm from './components/Tasks/CreateTaskForm';
import { Produit } from './pages/produit';
import { Rank } from './pages/Rank';
import Tables from './pages/Tables';
import TaskDetails from './components/Tasks/TaskDetails';
import Welcome from './pages/Gerant_layout/welcom';
import ListTasks from './components/Tasks/ListTasks';
import ResetPassword from './components/Login/ResetPassword';
import Movies from './pages/movie';
import { Depot } from './pages/Depot';
import { Chauffeur } from './pages/Chauffeurs';
import Panier from './pages/Gerant_layout/panier';




function App() {

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  
  
  // Initialize Firebase

  

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Home | Admin Dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Movie Flow" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Movie Flow" />
              <Profile />
            </>
          }
        />
        <Route
          path="/newtask"
          element={
            <>
              <PageTitle title="Basic Chart | Movie Flow" />
              <CreateTaskForm />
            </>
          }
        />

        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Movie Flow" />
              <Chart />
            </>
          }
        />
        <Route
          path="/task/:id"
          element={
            <>
              <PageTitle title="Basic Chart | Movie Flow" />
              <TaskDetails />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="Basic Chart | Movie Flow" />
              <UsersDahboard />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Login/>
            </>
          }
        />
     
        <Route
          path="/produits"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Produit />
            </>
          }
        />
        <Route
          path="/depot"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Depot />
            </>
          }
        />
        
           <Route
          path="/chauffeurs"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chauffeur />
            </>
          }
        />
         <Route
          path="/welcome"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Welcome />
            </>
          }
        />
      
       <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
              <PageTitle title="Basic Chart | Movie Flow" />
              <Login />
            </>
          }
        />
         <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        
        <Route path="/listtasks" element={<ListTasks />} /> 

        <Route path="/listtasks" element={<ListTasks />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Movie Flow" />
              <Buttons />
            </>
          }
        />

      <Route
        path="/movies"
        element={
          <>
            <PageTitle title="Movies | Admin Dashboard" />
            <Movies />
          </>
        }
      />

      </Routes>
    </>
  );
}

export default App;
