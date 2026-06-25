import { useState } from 'react'
import {router} from './app.routes'
import { RouterProvider } from 'react-router-dom'
import {AuthProvider} from "./features/auth/auth.context"
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark"
          hideProgressBar
          toastClassName="bg-[#111827] text-gray-200 border border-white/10 text-sm"
        />
    </AuthProvider>
  )
}

export default App