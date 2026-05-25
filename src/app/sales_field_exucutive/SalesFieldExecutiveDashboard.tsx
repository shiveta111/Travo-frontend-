// This component is the entry point for the Sales Field Executive module.
// It re-exports the main FieldSalesExecutive page which has full API integration:
//   - GET  /leads/all    → fetches & displays all leads
//   - POST /leads/create → submits new lead from the form
// Route key: 'sales-field-executive'

export { FieldSalesExecutive as SalesFieldExecutiveDashboard } from '../pages/FieldSalesExecutive';
