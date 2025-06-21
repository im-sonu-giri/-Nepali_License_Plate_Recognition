import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast' // For notifications

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-text-primary">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--primary)'
            }
          }}
        />
      </div>
    </Router>
  )
}