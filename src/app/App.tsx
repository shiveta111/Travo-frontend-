import { useState, lazy, Suspense } from 'react';

import { Sidebar }
  from './components/Sidebar';

import { TopBar }
  from './components/TopBar';

import { Login }
  from './Login';

const Dashboard           = lazy(() => import('./admin/Dashboard').then(m => ({ default: m.Dashboard })));
const FlightControlTower  = lazy(() => import('./components/FlightControlTower').then(m => ({ default: m.FlightControlTower })));
const CreditControlDashboard = lazy(() => import('./components/CreditControlDashboard').then(m => ({ default: m.CreditControlDashboard })));
const SalesPipeline       = lazy(() => import('./components/SalesPipeline').then(m => ({ default: m.SalesPipeline })));
const SalesSupport        = lazy(() => import('./components/SalesSupport').then(m => ({ default: m.SalesSupport })));
const PaymentAccounting   = lazy(() => import('./components/PaymentAccounting').then(m => ({ default: m.PaymentAccounting })));
const InventoryBoard      = lazy(() => import('./components/InventoryBoard').then(m => ({ default: m.InventoryBoard })));
const TripManagement      = lazy(() => import('./components/TripManagement').then(m => ({ default: m.TripManagement })));
const ReservationsBookings = lazy(() => import('./components/ReservationsBookings').then(m => ({ default: m.ReservationsBookings })));
const OperationsCalendar  = lazy(() => import('./components/OperationsCalendar').then(m => ({ default: m.OperationsCalendar })));
const AnalyticsReporting  = lazy(() => import('./components/AnalyticsReporting').then(m => ({ default: m.AnalyticsReporting })));
const AddUser             = lazy(() => import('./user_and_role_management/AddUser').then(m => ({ default: m.AddUser })));
const AddRole             = lazy(() => import('./user_and_role_management/AddRole').then(m => ({ default: m.AddRole })));
const DepartmentManagement = lazy(() => import('./user_and_role_management/DepartmentManagement').then(m => ({ default: m.DepartmentManagement })));
const Countries           = lazy(() => import('./setting/Countries').then(m => ({ default: m.Countries })));
const States              = lazy(() => import('./setting/States').then(m => ({ default: m.States })));
const Cities              = lazy(() => import('./setting/Cities').then(m => ({ default: m.Cities })));

import {
  useAuth
} from '../auth/AuthContext';



export default function App() {

  // const {
  //   isAuthenticated
  // } = useAuth();

  const {
    isAuthenticated,
    loading
  } = useAuth();

  const [activeModule,
    setActiveModule] =
    useState('dashboard');

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  if (!isAuthenticated) {

    return <Login onLogin={() => {}} />;

  }
  

  const renderContent =
    () => {

      switch (
        activeModule
      ) {

        case 'dashboard':
          return <Dashboard />;

        case 'flight-control':
          return <FlightControlTower />;

        case 'credit-control':
          return <CreditControlDashboard />;

        case 'inventory':
          return <InventoryBoard />;

        case 'sales-pipeline':
        case 'leads-management':
        case 'all-leads':
          return <SalesPipeline initialView="list" initialStatus="All" />;
        case 'new-leads':
          return <SalesPipeline initialView="add" />;

        case 'sales-support':
          return <SalesSupport />;

        case 'payments':
          return <PaymentAccounting />;

        case 'trips':
          return <TripManagement />;

        case 'reservations':
          return <ReservationsBookings />;

        case 'operations':
          return <OperationsCalendar />;

        case 'analytics':
          return <AnalyticsReporting />;

        case 'add-user':
          return <AddUser />;

        case 'add-role':
          return <AddRole />;

        case 'departments':
          return <DepartmentManagement />;

        case 'countries':
          return <Countries />;
        
        case 'states':
          return <States />;

        case 'cities':
          return <Cities />;
        
        default:

          return (

            <div className="
              flex
              items-center
              justify-center
              h-full
            ">

              <div className="
                text-center
              ">

                <h2 className="
                  text-foreground
                  mb-2
                ">

                  Module Under Development

                </h2>

                <p className="
                  text-muted-foreground
                ">

                  This module is coming soon.

                </p>

              </div>

            </div>

          );

      }

    };


  return (

    <div className="
      size-full
      flex
      bg-background
    ">

      <Sidebar
        activeModule={
          activeModule
        }

        onModuleChange={
          setActiveModule
        }
      />


      <div className="
        flex-1
        flex
        flex-col
        min-w-0
      ">

        <TopBar />


        <main
          className={`
            flex-1
            overflow-y-auto

            ${
              activeModule === 'trips' ||

              activeModule === 'reservations' ||

              activeModule === 'operations' ||

              activeModule === 'add-user' ||

              activeModule === 'add-role' ||

              activeModule === 'departments'

                ? 'p-0'

                : 'p-6'
            }
          `}
        >  

          <div
            className={
              activeModule === 'trips' ||

              activeModule === 'reservations' ||

              activeModule === 'operations' ||

              activeModule === 'add-user' ||

              activeModule === 'add-role' ||

              activeModule === 'departments'

                ? 'h-full'

                : 'max-w-[1600px] mx-auto'
            }
          >

            <Suspense fallback={<div>Loading...</div>}>
            {renderContent()}
          </Suspense>

          </div>

        </main>

      </div>

    </div>

  );

}