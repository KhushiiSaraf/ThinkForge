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
        dark:border-slate-700
        dark:bg-slate-900
        dark:hover:border-indigo-400
        dark:hover:bg-slate-800
      "
    >
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
          dark:bg-slate-800
          dark:group-hover:bg-indigo-600
        "
      >
        <Plus
          size={28}
          className="
            text-slate-700
            transition-colors
            duration-300
            group-hover:text-white
            dark:text-slate-300
          "
        />
      </div>

      <h2 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Create New Note
      </h2>

      <p className="mt-2 px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Start capturing ideas, research, or AI-generated insights.
      </p>
    </button>
  );
}

export default CreateNoteCard;