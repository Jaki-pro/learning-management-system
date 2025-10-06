
'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../../../../lib/api';
import Card from '../../../../../components/ui/Card';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import Input from '../../../../../components/ui/Input';
import TextAreaInput from '../../../../../components/ui/TextAreaInput';
import Button from '../../../../../components/ui/Button';
import { ChevronDown, ChevronUp, Pencil, Trash2, Search } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import Fuse from 'fuse.js';

interface Lesson {
  documentId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
}
interface Module {
  documentId: string;
  title: string;
  description?: string;
  order?: number;
  lessons: Lesson[];
}
interface Course {
  documentId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  level?: string;
  duration?: number;
  modules: Module[];
}

export default function CourseEditorPage() {
  const { role } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState(false);

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [editModuleData, setEditModuleData] = useState({ title: '', description: '' });
  const [editLessonData, setEditLessonData] = useState({ title: '', videoUrl: '' });
  const [editCourseData, setEditCourseData] = useState({ title: '', description: '' });
  const [newLessonData, setNewLessonData] = useState<Record<string, { title: string; videoUrl: string }>>({});

  const [searchQuery, setSearchQuery] = useState('');

  // --- Format fetched course ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCourse = (raw: any): Course | null => {
    if (!raw) return null;
    const payload = raw.data ?? raw;
    const attrs = payload.attributes ?? payload;
    const modulesRaw = (attrs.modules?.data ?? attrs.modules) || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modules: Module[] = modulesRaw.map((m: any) => {
      const mAttrs = m.attributes ?? m;
      const lessonsRaw = (mAttrs.lessons?.data ?? mAttrs.lessons) || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lessons: Lesson[] = lessonsRaw.map((l: any) => {
        const lAttrs = l.attributes ?? l;
        return {
          documentId: l.documentId ?? l.id,
          title: lAttrs.title,
          content: lAttrs.content,
          videoUrl: lAttrs.videoUrl,
          duration: lAttrs.duration,
          order: lAttrs.order,
        };
      });
      return {
        documentId: m.documentId ?? m.id,
        title: mAttrs.title,
        description: mAttrs.description,
        order: mAttrs.order,
        lessons,
      };
    });

    return {
      documentId: payload.documentId ?? payload.id,
      title: attrs.title,
      description: attrs.description,
      thumbnail: attrs.thumbnail,
      level: attrs.level,
      duration: attrs.duration,
      modules,
    };
  };

  // --- Fetch course ---
  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const response = await fetchApi(`/api/courses/${courseId}?populate[modules][populate]=lessons`);
      const formatted = formatCourse(response);
      setCourse(formatted);
      if (formatted) setEditCourseData({ title: formatted.title, description: formatted.description ?? '' });
    } catch (error) {
      console.error('Failed to fetch course', error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // --- Search functionality ---
  const fuse = useMemo(() => {
    if (!course) return null;
    const options = {
      keys: ['title', 'lessons.title'],
      includeScore: true,
      threshold: 0.3,
    };
    const modulesWithLessons = course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((l) => ({ ...l })),
    }));
    return new Fuse(modulesWithLessons, options);
  }, [course]);

  const filteredModules = useMemo(() => {
    if (!searchQuery || !fuse) return course?.modules ?? [];
    const results = fuse.search(searchQuery);
    return results.map((r) => r.item);
  }, [searchQuery, fuse, course]);

  // --- Update/Delete Course ---
  const handleUpdateCourse = async () => {
    if (!course) return;
    try {
      await fetchApi(`/api/courses/${course.documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: editCourseData }),
      });
      setEditingCourse(false);
      await fetchCourse();
    } catch (error) {
      console.error('Failed to update course', error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm('Are you sure you want to delete this course and all its modules/lessons?')) return;
    try {
      await fetchApi(`/api/courses/${courseId}`, { method: 'DELETE' });
      alert('Course deleted successfully.');
      router.push('/courses');
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  // --- Module and Lesson functions ---
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    try {
      await fetchApi('/api/modules', {
        method: 'POST',
        body: JSON.stringify({ data: { title: newModuleTitle, description: newModuleDescription, course: courseId } }),
      });
      setNewModuleTitle('');
      setNewModuleDescription('');
      await fetchCourse();
    } catch (error) {
      console.error('Failed to add module', error);
    }
  };

  const handleEditModule = (m: Module) => {
    setEditingModuleId(m.documentId);
    setEditModuleData({ title: m.title, description: m.description ?? '' });
  };

  const handleUpdateModule = async (moduleId: string) => {
    try {
      await fetchApi(`/api/modules/${moduleId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: editModuleData }),
      });
      setEditingModuleId(null);
      await fetchCourse();
    } catch (error) {
      console.error('Failed to update module', error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      await fetchApi(`/api/modules/${moduleId}`, { method: 'DELETE' });
      await fetchCourse();
    } catch (error) {
      console.error('Failed to delete module', error);
    }
  };

  const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    const payload = newLessonData[moduleId];
    if (!payload || !payload.title) return;
    try {
      await fetchApi('/api/lessons', {
        method: 'POST',
        body: JSON.stringify({ data: { title: payload.title, videoUrl: payload.videoUrl, module: moduleId } }),
      });
      setNewLessonData((prev) => ({ ...prev, [moduleId]: { title: '', videoUrl: '' } }));
      await fetchCourse();
    } catch (error) {
      console.error('Failed to add lesson', error);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.documentId);
    setEditLessonData({ title: lesson.title, videoUrl: lesson.videoUrl ?? '' });
  };

  const handleUpdateLesson = async (lessonId: string) => {
    try {
      await fetchApi(`/api/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify({ data: editLessonData }) });
      setEditingLessonId(null);
      await fetchCourse();
    } catch (error) {
      console.error('Failed to update lesson', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await fetchApi(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      await fetchCourse();
    } catch (error) {
      console.error('Failed to delete lesson', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (loading) return <div>Loading course...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <PageWrapper>
      {/* Search Bar */}
      
      <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-md">
        <Input
          placeholder="Search modules and lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div> 
    </div>


      {/* Course Header */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex-1">
          {editingCourse ? (
            <div className="space-y-2">
              <Input
                value={editCourseData.title}
                className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                onChange={(e) => setEditCourseData({ ...editCourseData, title: e.target.value })}
              />
              <TextAreaInput
                value={editCourseData.description}
                onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
                className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdateCourse}>Save</Button>
                <Button variant="secondary" onClick={() => setEditingCourse(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </>
          )}
        </div>

        {(role === 'admin' || role === 'developer') && !editingCourse && (
          <div className="flex gap-2">
            <button onClick={() => setEditingCourse(true)} className="p-2 rounded-full hover:bg-muted">
              <Pencil className="w-5 h-5 text-primary" />
            </button>
            <button onClick={handleDeleteCourse} className="p-2 rounded-full hover:bg-muted">
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {filteredModules.length === 0 && searchQuery ? (
          <p className="text-muted-foreground">No modules or lessons match your search.</p>
        ) : (
          filteredModules.map((module, m_ind) => {
            const isExpanded = expandedModules[module.documentId];
            const isEditing = editingModuleId === module.documentId;

            return (
              <Card key={module.documentId} className="p-6 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          value={editModuleData.title}
                          className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                          onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                        />
                        <TextAreaInput
                          value={editModuleData.description}
                          className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                          onChange={(e) => setEditModuleData({ ...editModuleData, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateModule(module.documentId)}>Save</Button>
                          <Button variant="secondary" onClick={() => setEditingModuleId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold">{`${m_ind + 1}. ${module.title}`}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(role === 'admin' || role === 'developer') && (
                      <>
                        <button onClick={() => handleEditModule(module)} className="p-2 rounded-full hover:bg-muted">
                          <Pencil className="w-4 h-4 text-primary" />
                        </button>
                        <button onClick={() => handleDeleteModule(module.documentId)} className="p-2 rounded-full hover:bg-muted">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleModule(module.documentId)} className="p-2 rounded-full hover:bg-muted">
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    <ul className="space-y-3">
                      {module.lessons.map((lesson, ind) => {
                        const isEditingLesson = editingLessonId === lesson.documentId;
                        return (
                          <li
                            key={lesson.documentId}
                            className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between
                            border border-border rounded-xl p-4 transition-all duration-200
                            bg-card hover:bg-muted/60 shadow-sm hover:shadow-md
                            dark:bg-[#141a30] dark:hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                                {`${ind + 1}`.padStart(2, '0')}
                              </span>
                              {isEditingLesson ? (
                                <div className="flex flex-col gap-2">
                                  <Input
                                    value={editLessonData.title}
                                    className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                                    onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                                  />
                                  <Input
                                    value={editLessonData.videoUrl}
                                    className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                                    onChange={(e) => setEditLessonData({ ...editLessonData, videoUrl: e.target.value })}
                                  />
                                  <div className="flex gap-2">
                                    <Button onClick={() => handleUpdateLesson(lesson.documentId)}>Save</Button>
                                    <Button variant="secondary" onClick={() => setEditingLessonId(null)}>Cancel</Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span className="font-medium text-foreground">{lesson.title}</span>
                                  {lesson.videoUrl && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 sm:mt-0 text-sm text-primary hover:underline"
                                    >
                                      Watch Video →
                                    </a>
                                  )}
                                </>
                              )}
                            </div>

                            {!isEditingLesson && (role === 'admin' || role === 'developer') && (
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <button onClick={() => handleEditLesson(lesson)} className="p-2 rounded-full hover:bg-muted">
                                  <Pencil className="w-4 h-4 text-primary" />
                                </button>
                                <button onClick={() => handleDeleteLesson(lesson.documentId)} className="p-2 rounded-full hover:bg-muted">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Add new lesson form */}
                    {(role === 'admin' || role === 'developer') && (
                      <form onSubmit={(e) => handleAddLesson(e, module.documentId)} className="flex flex-col gap-2 mt-3">
                        <Input
                          placeholder="New lesson title"
                          value={newLessonData[module.documentId]?.title || ''}
                          onChange={(e) =>
                            setNewLessonData((prev) => ({
                              ...prev,
                              [module.documentId]: { ...prev[module.documentId], title: e.target.value },
                            }))
                          }
                          className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                        />
                        <Input
                          placeholder="Video URL (optional)"
                          value={newLessonData[module.documentId]?.videoUrl || ''}
                          onChange={(e) =>
                            setNewLessonData((prev) => ({
                              ...prev,
                              [module.documentId]: { ...prev[module.documentId], videoUrl: e.target.value },
                            }))
                          }
                          className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                        />
                        <Button type="submit">Add Lesson</Button>
                      </form>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Add new module */}
      {(role === 'admin' || role === 'developer') && (
        <form onSubmit={handleAddModule} className="mt-8 flex flex-col gap-2 max-w-md">
          <Input
            placeholder="New module title"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
          />
          <TextAreaInput
            placeholder="Module description (optional)"
            value={newModuleDescription}
            onChange={(e) => setNewModuleDescription(e.target.value)}
            className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
          />
          <Button type="submit">Add Module</Button>
        </form>
      )}
    </PageWrapper>
  );
}

