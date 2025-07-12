import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast';

// Error boundary component để bắt lỗi
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị UI lỗi
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log lỗi ra console
    console.error("App Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // UI khi có lỗi
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h2>
              <p className="text-gray-600 mb-6">Rất tiếc, đã có lỗi xảy ra. Vui lòng tải lại trang hoặc thử lại sau.</p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Tải lại trang
                </button>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              maxWidth: '500px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              }
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
              duration: 5000,
            },
            loading: {
              duration: 10000, // Longer duration for loading
            }
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
