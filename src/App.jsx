import { CrateProvider } from './crate/CrateContext'
import { AuthProvider } from './auth/AuthContext'
import Room from './room/Room'
import Crate from './crate/Crate'
import AudioPlayer from './crate/AudioPlayer'
import NowPlaying from './crate/NowPlaying'
import EditPanel from './edit/EditPanel'
import Title from './chrome/Title'
import AboutButton from './chrome/AboutButton'
import NewsletterButton from './newsletter/NewsletterButton'
import './chrome/Chrome.css'

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
