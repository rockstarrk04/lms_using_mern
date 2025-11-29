import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

// --- Sub-components for better organization ---

const AddModuleForm = ({ courseId, onModuleAdded }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to add module." }));
        throw new Error(errorData.message);
      }
      toast.success("Module added!");
      setTitle("");
      onModuleAdded(); // Callback to refetch course data
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New module title..."
        className="flex-grow appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {loading ? "Adding..." : "Add Module"}
      </button>
    </form>
  );
};

const AddLessonForm = ({ moduleId, onLessonAdded }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to add lesson." }));
        throw new Error(errorData.message);
      }
      toast.success("Lesson added!");
      setTitle("");
      onLessonAdded(); // Callback to refetch course data
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2 pl-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New lesson title..."
        className="flex-grow appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-500 disabled:opacity-60">
        Add Lesson
      </button>
    </form>
  );
};

const EditLessonModal = ({ lesson, onClose, onLessonUpdated }) => {
  const [formData, setFormData] = useState({
    title: lesson.title || "",
    description: lesson.description || "",
    videoUrl: lesson.videoUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lesson._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to update lesson." }));
        throw new Error(errorData.message);
      }
      toast.success("Lesson updated successfully!");
      onLessonUpdated(); // Refresh course data
      onClose(); // Close the modal
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-lg rounded-xl bg-slate-800 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white">Edit Lesson</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-300">Lesson Title</label>
            <input id="title" name="title" type="text" required value={formData.title} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-300">Description</label>
            <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label htmlFor="videoUrl" className="mb-1 block text-sm font-medium text-slate-300">Video URL (e.g., YouTube embed link)</label>
            <input id="videoUrl" name="videoUrl" type="url" value={formData.videoUrl} onChange={handleInputChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-4 border-t border-slate-700 pt-5">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CurriculumItemActions = ({ type, item, onDeleted, onEdit }) => {
  const { token } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${type}s/${item._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to delete ${type}.` }));
        throw new Error(errorData.message);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      onDeleted(); // Refresh the course data
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-4 text-xs">
      <button onClick={() => onEdit(item)} className="text-slate-400 hover:text-white">Edit</button>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-400"
      >Delete</button>
    </div>
  );
};

const PublishToggle = ({ course, onCourseUpdate }) => {
  const { token } = useContext(AuthContext);

  const handleToggle = async () => {
    const newStatus = !course.isPublished;
    const action = newStatus ? "publish" : "unpublish";
    if (!window.confirm(`Are you sure you want to ${action} this course?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${course._id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to ${action} course.` }));
        throw new Error(errorData.message);
      }
      toast.success(`Course ${action}ed successfully!`);
      onCourseUpdate(); // Refresh course data
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <button type="button" onClick={handleToggle} className={`${course.isPublished ? 'bg-blue-600' : 'bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900`} role="switch" aria-checked={course.isPublished}>
      <span className={`${course.isPublished ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
  );
};

const SortableLessonItem = ({ lesson, onEdit, onDeleted }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between rounded-md bg-slate-900/50 p-3">
      <div {...attributes} {...listeners} className="flex-grow cursor-grab touch-none">
        <p className="text-slate-300">{lesson.title}</p>
      </div>
      <CurriculumItemActions type="lesson" item={lesson} onDeleted={onDeleted} onEdit={onEdit} />
    </li>
  );
};

const SortableModuleItem = ({ module, lessons, onLessonAdded, onLessonEdit, onLessonDeleted, onModuleDeleted }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg bg-slate-800 p-5">
      <div {...attributes} {...listeners} className="flex items-center justify-between cursor-grab touch-none">
        <h3 className="text-xl font-semibold text-white">{module.title}</h3>
        <CurriculumItemActions type="module" item={module} onDeleted={onModuleDeleted} onEdit={() => toast.error("Module editing not implemented yet.")} />
      </div>
      <SortableContext items={lessons.map(l => l._id)} strategy={verticalListSortingStrategy}>
        <ul className="mt-4 space-y-2 pl-4">
          {lessons.map((lesson) => (
            <SortableLessonItem key={lesson._id} lesson={lesson} onEdit={onLessonEdit} onDeleted={onLessonDeleted} />
          ))}
          {lessons.length === 0 && (
            <p className="text-sm text-slate-500 pl-2">No lessons in this module yet.</p>
          )}
        </ul>
      </SortableContext>
      <AddLessonForm moduleId={module._id} onLessonAdded={onLessonAdded} />
    </div>
  );
};

// --- Main Component ---

function ManageCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'curriculum'

  useEffect(() => {
    fetchCourse();
  }, [courseId, navigate]);

  const fetchCourse = async () => {
      try {
        setPageLoading(true);
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course data.");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server.");
        }

        const data = await response.json();
        setCourse(data.course);
        setThumbnailPreview(data.course.thumbnail);
        setIsOrderChanged(false); // Reset changed status on fetch
      } catch (err) {
        toast.error(err.message);
        navigate("/instructor/dashboard");
      } finally {
        setPageLoading(false);
      }
    };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', course.title);
    formDataToSend.append('description', course.description);
    formDataToSend.append('category', course.category);
    formDataToSend.append('level', course.level);
    if (thumbnailFile) {
      formDataToSend.append('thumbnail', thumbnailFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          // "Content-Type" is set automatically by the browser for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to update course." }));
        throw new Error(errorData.message);
      }

      toast.success("Course updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCourse((prevCourse) => {
      const oldModules = prevCourse.curriculum;
      const oldModuleIndex = oldModules.findIndex(m => m._id === active.id);
      const newModuleIndex = oldModules.findIndex(m => m._id === over.id);

      if (oldModuleIndex !== -1 && newModuleIndex !== -1) {
        const reorderedModules = arrayMove(oldModules, oldModuleIndex, newModuleIndex);
        setIsOrderChanged(true);
        return { ...prevCourse, curriculum: reorderedModules };
      }

      let newCurriculum = [...prevCourse.curriculum];
      let activeModuleIndex = -1, overModuleIndex = -1;
      newCurriculum.forEach((module, index) => {
        if (module.lessons.some(l => l._id === active.id)) activeModuleIndex = index;
        if (module.lessons.some(l => l._id === over.id)) overModuleIndex = index;
      });

      if (activeModuleIndex !== -1 && overModuleIndex !== -1) {
        const activeLessons = newCurriculum[activeModuleIndex].lessons;
        const overLessons = newCurriculum[overModuleIndex].lessons;
        const oldLessonIndex = activeLessons.findIndex(l => l._id === active.id);
        const newLessonIndex = overLessons.findIndex(l => l._id === over.id);

        if (activeModuleIndex === overModuleIndex) {
          newCurriculum[activeModuleIndex].lessons = arrayMove(activeLessons, oldLessonIndex, newLessonIndex);
        } else {
          const [movedLesson] = activeLessons.splice(oldLessonIndex, 1);
          overLessons.splice(newLessonIndex, 0, movedLesson);
        }
        setIsOrderChanged(true);
        return { ...prevCourse, curriculum: newCurriculum };
      }
      return prevCourse;
    });
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/curriculum-order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ curriculum: course.curriculum }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to save order." }));
        throw new Error(errorData.message);
      }
      toast.success("Curriculum order saved successfully!");
      setIsOrderChanged(false);
    } catch (err) {
      toast.error(err.message);
      fetchCourse();
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (pageLoading || !course) {
    return <div className="text-center py-20 text-white">Loading Course Manager...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 text-white">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-400">Manage Course</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
          <span className={`text-sm font-semibold ${course.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
          <PublishToggle course={course} onCourseUpdate={fetchCourse} />
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700 mb-8">
        <nav className="-mb-px flex flex-wrap space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'}`}>Course Details</button>
          <button onClick={() => setActiveTab('curriculum')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'curriculum' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'}`}>Curriculum</button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          {/* Thumbnail and Details Form from old EditCourse.jsx */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Course Details</h2>
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Course Thumbnail</label>
              <div className="mt-2 flex items-center gap-x-3">
                {thumbnailPreview ? <img src={thumbnailPreview} alt="Thumbnail preview" className="h-24 w-40 rounded-md object-cover" /> : <div className="h-24 w-40 flex items-center justify-center rounded-md bg-slate-800 text-slate-500">No Image</div>}
                <input type="file" name="thumbnail" id="thumbnail" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600" />
              </div>
            </div>
            {/* Other form fields */}
            <div><label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Course Title</label><input id="title" name="title" type="text" required value={course.title} onChange={handleDetailChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Course Description</label><textarea id="description" name="description" rows={4} required value={course.description} onChange={handleDetailChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white"></textarea></div>
            <div><label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label><input id="category" name="category" type="text" required value={course.category} onChange={handleDetailChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white" /></div>
            <div><label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Level</label><select id="level" name="level" value={course.level} onChange={handleDetailChange} className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white"><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option></select></div>
          </div>
          <div className="flex justify-end gap-4 pt-6"><button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Saving..." : "Save Details"}</button></div>
        </form>
      )}

      {activeTab === 'curriculum' && (
        <div>
          {/* Curriculum Management from old ManageCourse.jsx */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Curriculum</h2>
            {isOrderChanged && <button onClick={handleSaveOrder} disabled={isSavingOrder} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">{isSavingOrder ? "Saving..." : "Save Order"}</button>}
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={course.curriculum?.map(m => m._id) || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {course.curriculum?.map(module => <SortableModuleItem key={module._id} module={module} lessons={module.lessons || []} onLessonAdded={fetchCourse} onLessonEdit={(lesson) => setEditingLesson(lesson)} onLessonDeleted={fetchCourse} onModuleDeleted={fetchCourse} />)}
              </div>
            </SortableContext>
          </DndContext>
          <div className="mt-8 border-t border-slate-700 pt-6"><h3 className="text-lg font-semibold text-white">Add a New Module</h3><AddModuleForm courseId={course._id} onModuleAdded={fetchCourse} /></div>
        </div>
      )}

      {editingLesson && <EditLessonModal lesson={editingLesson} onClose={() => setEditingLesson(null)} onLessonUpdated={fetchCourse} />}
    </div>
  );
}

export default ManageCourse;