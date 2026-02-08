import { useState } from 'react'
import AppLayout from './layout/app-layout'
import './App.css'
import {Button} from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import JobListing from './pages/JobListing'
import Job from './pages/Job'
import PostJob from './pages/PostJob'
import SavedJob from './pages/SavedJob'
import MyJobs from './pages/MyJobs'
import { ThemeProvider } from './components/theme-provider'
import ProtectedRoute from './components/protected-route'

const router = createBrowserRouter([
  {
    element : <AppLayout />,
    children :[
      {
        path: "/",
        element: <LandingPage />
      }, {
        path: "/onboarding",
        element: (
        <ProtectedRoute>
        <Onboarding />
        </ProtectedRoute>
      )
      },{
        path: "/jobs",
        element:( 
        <ProtectedRoute>
        <JobListing />
        </ProtectedRoute>
      )
      },{
        path: "/job/:id",
        element: (
        <ProtectedRoute>
        <Job />
        </ProtectedRoute>
      )
      },{
        path: "/post-job",
        element: (
        <ProtectedRoute>
        <PostJob />
        </ProtectedRoute>
        )
      },{
        path: "/saved-jobs",
        element: (
        <ProtectedRoute>
        <SavedJob />
        </ProtectedRoute>
        )
      },{
        path: "/my-jobs",
        element: (
        <ProtectedRoute>
        <MyJobs />
        </ProtectedRoute>
        )
      }
    ]
  }
])

function App() {
  const [count, setCount] = useState(0)

  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
   
      
   
  )
}

export default App
