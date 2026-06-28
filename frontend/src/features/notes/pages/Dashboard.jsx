import { Search, Bell, LogOut, Plus, Menu, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import CreateNoteCard from "../components/CreateNoteCard";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from "../../auth/hooks/useAuth";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notes, handleGetAllNotes, handleCreateNote, handleDeleteNote } = useNotes()
  const { user, handleLogout } = useAuth()

  useEffect(() => {
    handleGetAllNotes()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-5 flex items-center justify-between">

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl">Noteflow</h1>
            </div>

            <div className="hidden md:flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-slate-100 font-medium">Notes</button>
              <button className="px-4 py-2 rounded-lg hover:bg-slate-100">Shared</button>
              <button className="px-4 py-2 rounded-lg hover:bg-slate-100">Trash</button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Search className="cursor-pointer text-slate-600" />
            <Bell className="cursor-pointer text-slate-600" />
            <div className="h-8 w-px bg-slate-300" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h3 className="font-semibold text-sm">{user?.name}</h3>
                <p className="text-xs text-slate-500">{user?.plan?.toUpperCase()} PLAN</p>
              </div>
              <img src="https://i.pravatar.cc/100" alt="" className="w-10 h-10 rounded-full" />
            </div>
            <LogOut onClick={handleLogout} className="cursor-pointer text-slate-600" />
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <button className="block w-full text-left px-5 py-4">Notes</button>
            <button className="block w-full text-left px-5 py-4">Shared</button>
            <button className="block w-full text-left px-5 py-4">Trash</button>
          </div>
        )}
      </nav>

      {/* PAGE */}
      <main className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl font-bold">My Research Notes</h1>
            <p className="text-slate-500 mt-2">Manage and organize your AI-powered insights.</p>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={async (id) => {
                await handleDeleteNote(id)
                await handleGetAllNotes()
                }}
            />
          ))}
          <CreateNoteCard onClick={handleCreateNote} />
        </section>
      </main>

    </div>
  );
}

export default Dashboard;