'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '../../../../../lib/api';
import Card from '../../../../../components/ui/Card';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';

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
  const params = useParams();
  const courseId = params.id as string; // now documentId, not numeric id

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  const [editModuleData, setEditModuleData] = useState({ title: '', description: '' });
  const [editLessonData, setEditLessonData] = useState({ title: '', videoUrl: '' });

  const [newLessonData, setNewLessonData] = useState<Record<string, { title: string; videoUrl: string }>>({});

 
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
          documentId: l.documentId ?? l.id, // fallback for older data
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
      const response = await fetchApi(
        `/api/courses/${courseId}?populate[modules][populate]=lessons`
      );
      const formatted = formatCourse(response);
      setCourse(formatted);
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

  // --- Add module ---
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    try {
      await fetchApi('/api/modules', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            title: newModuleTitle,
            description: newModuleDescription,
            course: courseId, // documentId of course
          },
        }),
      });
      setNewModuleTitle('');
      setNewModuleDescription('');
      await fetchCourse();
    } catch (error) {
      console.error('Failed to add module', error);
    }
  };

  // --- Add lesson ---
  const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    const payload = newLessonData[moduleId];
    if (!payload || !payload.title) return;
    try {
      await fetchApi('/api/lessons', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            title: payload.title,
            videoUrl: payload.videoUrl,
            module: moduleId, // documentId of module
          },
        }),
      });
      setNewLessonData(prev => ({ ...prev, [moduleId]: { title: '', videoUrl: '' } }));
      await fetchCourse();
    } catch (error) {
      console.error('Failed to add lesson', error);
    }
  };

  // --- Update/Delete Module ---
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

  // --- Update/Delete Lesson ---
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.documentId);
    setEditLessonData({ title: lesson.title, videoUrl: lesson.videoUrl ?? '' });
  };

  const handleUpdateLesson = async (lessonId: string) => {
    try {
      await fetchApi(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: editLessonData }),
      });
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

  // --- UI toggle ---
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (loading) return <div>Loading course editor...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-2">Editing: {course.title}</h1>
      <p className="text-muted-foreground mb-8">{course.description}</p>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Modules</h2>
        {course.modules?.map((module) => {
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
                        onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                      />
                      <Input
                        value={editModuleData.description}
                        onChange={(e) => setEditModuleData({ ...editModuleData, description: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateModule(module.documentId)}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditingModuleId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditModule(module)} className="p-2 rounded-full hover:bg-muted">
                    <Pencil className="w-4 h-4 text-primary" />
                  </button>
                  <button onClick={() => handleDeleteModule(module.documentId)} className="p-2 rounded-full hover:bg-muted">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
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
                                  onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                                />
                                <Input
                                  value={editLessonData.videoUrl}
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

                          {!isEditingLesson && (
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

                  {/* Add Lesson Form */}
                  <form
                    onSubmit={(e) => handleAddLesson(e, module.documentId)}
                    className="mt-6 p-4 border-t border-border space-y-4"
                  >
                    <h4 className="font-semibold">Add New Lesson</h4>
                    <div className="flex gap-4 items-start">
                      <Input
                        id={`lesson-title-${module.documentId}`}
                        label="Lesson Title"
                        type="text"
                        value={newLessonData[module.documentId]?.title ?? ''}
                        onChange={(e) =>
                          setNewLessonData(prev => ({
                            ...prev,
                            [module.documentId]: {
                              title: e.target.value,
                              videoUrl: prev[module.documentId]?.videoUrl ?? '',
                            },
                          }))
                        }
                      />
                      <Input
                        id={`lesson-url-${module.documentId}`}
                        label="Video URL"
                        type="text"
                        value={newLessonData[module.documentId]?.videoUrl ?? ''}
                        onChange={(e) =>
                          setNewLessonData(prev => ({
                            ...prev,
                            [module.documentId]: {
                              title: prev[module.documentId]?.title ?? '',
                              videoUrl: e.target.value,
                            },
                          }))
                        }
                      />
                      <Button type="submit" variant="secondary" className="self-end">
                        Add Lesson
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          );
        })}

        {/* Add new module */}
        <Card className="p-6 bg-muted/50 border-dashed">
          <h3 className="text-xl font-bold mb-4">Add a New Module</h3>
          <form onSubmit={handleAddModule} className="space-y-4">
            <Input
              id="new-module-title"
              label="Module Title"
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
            />
            <Input
              id="new-module-desc"
              label="Module Description"
              type="text"
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
            />
            <Button type="submit">Add Module</Button>
          </form>
        </Card>
      </div>
    </PageWrapper>
  );
}
