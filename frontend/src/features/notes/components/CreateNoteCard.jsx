import { Plus } from "lucide-react";
import { useNotes } from "../hooks/useNotes";

function CreateNoteCard() {
    const { handleCreateNote } = useNotes();
  return (
    <button
    onClick={handleCreateNote}
      className="
        group
        min-h-[300px]
        rounded-2xl
        border-2
        border-dashed
        border-slate-300
        bg-white
        flex
        flex-col
        items-center
        justify-center
        transition-all
        duration-300
        hover:border-slate-900
        hover:bg-slate-100
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      {/* Plus Icon */}
      <div
        className="
          w-16
          h-16
          rounded-full
          bg-slate-100
          flex
          items-center
          justify-center
          transition-all
          duration-300
          group-hover:bg-slate-900
          group-hover:scale-110
        "
      >
        <Plus
          size={28}
          className="
            text-slate-700
            transition-colors
            duration-300
            group-hover:text-white
          "
        />
      </div>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">
        Create New Note
      </h2>

      <p className="mt-2 text-sm text-slate-500 text-center px-8">
        Start capturing ideas, research, or AI-generated insights.
      </p>
    </button>
  );
}

export default CreateNoteCard;