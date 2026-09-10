import { CrateProvider } from './context/CrateContext'
import { AuthProvider } from './context/AuthContext'
import Room from './components/room/Room'
import Crate from './components/crate/Crate'
import AudioPlayer from './components/crate/AudioPlayer'
import NowPlaying from './components/crate/NowPlaying'
import EditPanel from './components/edit/EditPanel'
import Title from './components/chrome/Title'
import AboutButton from './components/chrome/AboutButton'
import NewsletterButton from './components/newsletter/NewsletterButton'
import './components/chrome/Chrome.css'

function App() {
  return (
    <AuthProvider>
      <CrateProvider>
        <Room />
        <AudioPlayer />
        <Crate />
        <NowPlaying />
        <EditPanel />
        <Title />
        <div className="corner-stack">
          <AboutButton />
          <NewsletterButton />
        </div>
      </CrateProvider>
    </AuthProvider>
  )
}

export default App
