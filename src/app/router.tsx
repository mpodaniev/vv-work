import { createBrowserRouter } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { ContactsPage, HomePage, NotFoundPage, PartnerPage } from './routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'partners/:slug', element: <PartnerPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
