import { useState, lazy, Suspense } from 'react';

import { Sidebar }
  from './components/Sidebar';

import { TopBar }
  from './components/TopBar';

import { Login }
  from './Login';

const Dashboard = lazy(() => import('./admin/Dashboard').then(m => ({ default: m.Dashboard })));
const FlightControlTower = lazy(() => import('./components/FlightControlTower').then(m => ({ default: m.FlightControlTower })));
const CreditControlDashboard = lazy(() => import('./components/CreditControlDashboard').then(m => ({ default: m.CreditControlDashboard })));
const SalesPipeline = lazy(() => import('./pages/LeadManagement').then(m => ({ default: m.LeadManagement })));
const AddLeads = lazy(() => import('./pages/AddLeads').then(m => ({ default: m.AddLeads })));
const SalesSupport = lazy(() => import('./components/SalesSupport').then(m => ({ default: m.SalesSupport })));
const PaymentAccounting = lazy(() => import('./components/PaymentAccounting').then(m => ({ default: m.PaymentAccounting })));
const InventoryBoard = lazy(() => import('./components/InventoryBoard').then(m => ({ default: m.InventoryBoard })));
const TripManagement = lazy(() => import('./components/TripManagement').then(m => ({ default: m.TripManagement })));
const ReservationsBookings = lazy(() => import('./components/ReservationsBookings').then(m => ({ default: m.ReservationsBookings })));
const OperationsCalendar = lazy(() => import('./components/OperationsCalendar').then(m => ({ default: m.OperationsCalendar })));
const AnalyticsReporting = lazy(() => import('./components/AnalyticsReporting').then(m => ({ default: m.AnalyticsReporting })));
const AddUser = lazy(() => import('./user_and_role_management/AddUser').then(m => ({ default: m.AddUser })));
const AddRole = lazy(() => import('./user_and_role_management/AddRole').then(m => ({ default: m.AddRole })));
const DepartmentManagement = lazy(() => import('./user_and_role_management/DepartmentManagement').then(m => ({ default: m.DepartmentManagement })));
const Countries = lazy(() => import('./setting/Countries').then(m => ({ default: m.Countries })));
const States = lazy(() => import('./setting/States').then(m => ({ default: m.States })));
const Cities = lazy(() => import('./setting/Cities').then(m => ({ default: m.Cities })));
const Agency = lazy(() => import('./setting/Agency').then(m => ({ default: m.Agency })));
const MenuManagement = lazy(() => import('./admin/MenuManagement').then(m => ({ default: m.MenuManagement })));

const LeadManagement = lazy(() => import('./pages/LeadManagement').then(m => ({ default: m.LeadManagement })));
const SalesAnaltics = lazy(() => import('./pages/SalesAnaltics').then(m => ({ default: m.SalesAnaltics })));
const ViewGraph = lazy(() => import('./pages/ViewGraph').then(m => ({ default: m.ViewGraph })));
const Country = lazy(() => import('./pages/Country').then(m => ({ default: m.Country })));
const FieldSalesExecutive = lazy(() => import('./pages/FieldSalesExecutive').then(m => ({ default: m.FieldSalesExecutive })));
const SalesTeamLeader = lazy(() => import('./pages/SalesTeamLeader').then(m => ({ default: m.SalesTeamLeader })));
const SalesTeamMemberHistory = lazy(() => import('./sales_team_leader/SalesTeamMemberHistory').then(m => ({ default: m.SalesTeamMemberHistory })));
const SalesSupportExecutive = lazy(() => import('./pages/SalesSupportExecutive').then(m => ({ default: m.SalesSupportExecutive })));
const SalesPackage = lazy(() => import('./pages/SalesPackage').then(m => ({ default: m.SalesPackage })));
const Manager = lazy(() => import('./pages/Manager').then(m => ({ default: m.Manager })));
// [AUTO-IMPORT-MARKER]

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

    return <Login onLogin={() => { }} />;

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
        case 'add-leads':
        case 'new-leads':
          return <AddLeads />;

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

        case 'agency':
          return <Agency />;

        case 'countries':
          return <Countries />;

        case 'states':
          return <States />;

        case 'cities':
          return <Cities />;

        case 'menu-management':
          return <MenuManagement />;                case 'sales-analtics':
          return <SalesAnaltics />;

                case 'view-graph':
          return <ViewGraph />;

        // Field Sales Executive — both route keys supported
        case 'field-sales-executive':
        case 'sales-field-executive':
          return <FieldSalesExecutive />;

        // Sales Team Leader
        case 'sales-team-leader':
          return <SalesTeamLeader />;

        // Sales Team Member History
        case 'sales-team-member-history':
          return <SalesTeamMemberHistory />;

        // Sales Support Executive
        case 'sales-support-executive':
          return <SalesSupportExecutive />;

        // Sales Package
        case 'sales-package':
          return <SalesPackage />;

        // Manager
        case 'manager':
          return <Manager />;

        // [AUTO-ROUTING-MARKER]

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

            ${activeModule === 'trips' ||

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