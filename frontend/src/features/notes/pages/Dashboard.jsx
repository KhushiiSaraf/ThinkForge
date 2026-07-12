import { Search, Bell, LogOut, Plus, Menu, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from "../../auth/hooks/useAuth";
import ConfirmDialog from "../components/ConfirmDialog";
import { usePayment } from "../hooks/usePayment";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notes, handleGetAllNotes, handleCreateNote, handleDeleteNote, loading } = useNotes()
  const { user, handleLogout } = useAuth()
  const { loading: paymentLoading, handlePayment } = usePayment()

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState(null)

  const handleConfirm = async () => {
    if (confirmDialog?.type === 'delete') {
        await handleDeleteNote(confirmDialog.noteId)
        await handleGetAllNotes()
    } else if (confirmDialog?.type === 'logout') {
        handleLogout()
    }
    setConfirmDialog(null)
  }

  useEffect(() => {
    handleGetAllNotes()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

          {/* Left — Logo + Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-lg">Noteflow</h1>
            </div>

            <div className="hidden md:flex gap-1">
              <button className="px-4 py-2 rounded-lg bg-slate-100 font-medium text-sm">Notes</button>
              <button className="px-4 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-600">Shared</button>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-100">
              <Search size={18} className="text-slate-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100">
              <Bell size={18} className="text-slate-600" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h3 className="font-semibold text-sm">{user?.name}</h3>
                <p className="text-xs text-slate-400">{user?.plan?.toUpperCase()} PLAN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            {user?.plan !== 'pro' && (
    <button
        onClick={() => handlePayment(user, () => window.location.reload())}
        disabled={paymentLoading}
        className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
    >
        Go Pro
    </button>
)}
            <button onClick={() => setConfirmDialog({ type: 'logout' })} className="p-2 rounded-lg hover:bg-slate-100">
              <LogOut size={18} className="text-slate-600" />
          </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <button className="block w-full text-left px-5 py-4 text-sm">Notes</button>
            <button className="block w-full text-left px-5 py-4 text-sm">Shared</button>
          </div>
        )}
      </nav>

      {/* PAGE */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-1 text-sm">Here's what you've been working on.</p>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition text-sm font-medium"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* Notes Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-56 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))
          ) : notes.length === 0 ? (
            <div className="col-span-4 text-center py-20 text-slate-400">
              <p className="text-lg font-medium">No notes yet</p>
              <p className="text-sm mt-1">Click "New Note" to get started</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={() => setConfirmDialog({
                      type: 'delete',
                      noteId: note._id
                  })}
              />
          ))
          )}
        </section>
      </main>
      {confirmDialog && (
    <ConfirmDialog
        title={confirmDialog.type === 'delete' ? 'Delete Note' : 'Logout'}
        message={confirmDialog.type === 'delete' 
            ? 'Are you sure you want to delete this note? This cannot be undone.' 
            : 'Are you sure you want to logout?'
        }
        confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Logout'}
        danger={confirmDialog.type === 'delete'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog(null)}
    />
    )}
    </div>
  );
}

export default Dashboard;