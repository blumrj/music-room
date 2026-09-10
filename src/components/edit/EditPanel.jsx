import { useAuth } from '../../context/AuthContext'
import LoginForm from './LoginForm'
import EditTracks from './EditTracks'
import './Edit.css'

export default function EditPanel() {
  const { isEditOpen, closeEdit, isAuthenticated, checked } = useAuth()

  if (!isEditOpen) return null

  return (
    <div className="edit-backdrop" onClick={closeEdit}>
      <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
        {!checked ? (
          <p>Loading…</p>
        ) : isAuthenticated ? (
          <EditTracks />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  )
}
