import { useState } from 'react';

import { Sidebar }
  from './components/Sidebar';

import { TopBar }
  from './components/TopBar';

import { Login }
  from './Login';

import { Dashboard }
  from './admin/Dashboard';

import { FlightControlTower }
  from './components/FlightControlTower';

import { CreditControlDashboard }
  from './components/CreditControlDashboard';

import { SalesPipeline }
  from './components/SalesPipeline';

import { SalesSupport }
  from './components/SalesSupport';

import { PaymentAccounting }
  from './components/PaymentAccounting';

import { InventoryBoard }
  from './components/InventoryBoard';

import { TripManagement }
  from './components/TripManagement';

import { ReservationsBookings }
  from './components/ReservationsBookings';

import { OperationsCalendar }
  from './components/OperationsCalendar';

import { AnalyticsReporting }
  from './components/AnalyticsReporting';

import { AddUser }
  from './user_and_role_management/AddUser';

import { AddRole }
  from './user_and_role_management/AddRole';

import { DepartmentManagement }
  from './user_and_role_management/DepartmentManagement';


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

    return <Login onLogin={function (): void {
      throw new Error('Function not implemented.');
    } } />;

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
          return <SalesPipeline />;

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

            {renderContent()}

          </div>

        </main>

      </div>

    </div>

  );

}