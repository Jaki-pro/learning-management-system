'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { fetchApi } from '../../../../../lib/api';
import Card from '../../../../../components/ui/Card';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { Enrollment } from '../../../../../lib/types';

// Define more specific types for our editor
interface Lesson {
  id: number;
  title: string;
}
interface Module {
  id: number;
  attributes: {
    title: string;
    lessons: { data: { id: number; attributes: Lesson }[] };
  };
}
type Course = {
    id: number;
    title: string;
    description: string;
    documentId: string;
    modules: { data: Module[] };
    enrollments: { data: Enrollment };
};

export default function CourseEditorPage() {
  const params = useParams();
  const courseId = params.id;
    
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for the "Add Module" form
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // State for the "Add Lesson" forms (keyed by module ID)
  const [newLessonTitles, setNewLessonTitles] = useState<{ [key: number]: string }>({});

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      // Populate modules and their lessons
      const response = await fetchApi(`/api/courses/${courseId}?populate=modules.lessons`);
      setCourse(response.data);
      console.log(response.data, 'course data');
    } catch (error) {
      console.error("Failed to fetch course", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);
  console.log(courseId, 'courseId');
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    try {
      await fetchApi('/api/modules', {
        method: 'POST',
        body: JSON.stringify({ data: { title: newModuleTitle, course: courseId } }),
      });
      setNewModuleTitle('');
      await fetchCourse(); // Re-fetch the course to show the new module
    } catch (error) {
      console.error("Failed to add module", error);
    }
  };

  const handleAddLesson = async (e: React.FormEvent, moduleId: number) => {
    e.preventDefault();
    const lessonTitle = newLessonTitles[moduleId];
    if (!lessonTitle) return;
    try {
      await fetchApi('/api/lessons', {
        method: 'POST',
        body: JSON.stringify({ data: { title: lessonTitle, module: moduleId } }),
      });
      setNewLessonTitles(prev => ({ ...prev, [moduleId]: '' }));
      await fetchCourse(); // Re-fetch to show the new lesson
    } catch (error) {
      console.error("Failed to add lesson", error);
    }
  };

  if (loading) return <div>Loading course editor...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-2">Editing: {course.title}</h1>
      <p className="text-muted-foreground mb-8">{course.description}</p>
      
      {/* MODULES SECTION */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Modules</h2>
        {course.modules?.data?.map((module) => (
          <Card key={module.id} className="p-6">
            <h3 className="text-xl font-bold">{module.attributes.title}</h3>
            {/* LESSONS LIST */}
            <ul className="mt-4 space-y-2 list-disc list-inside">
              {module.attributes.lessons.data.map((lesson) => (
                <li key={lesson.id}>{lesson.attributes.title}</li>
              ))}
            </ul>
            {/* ADD LESSON FORM */}
            <form onSubmit={(e) => handleAddLesson(e, module.id)} className="mt-6 flex gap-4 items-end">
              <Input
                id={`lesson-${module.id}`}
                label="New Lesson Title"
                type="text"
                value={newLessonTitles[module.id] || ''}
                onChange={(e) => setNewLessonTitles(prev => ({ ...prev, [module.id]: e.target.value }))}
                className="flex-grow"
              />
              <Button type="submit" variant="secondary">Add Lesson</Button>
            </form>
          </Card>
        ))}
        
        {/* ADD MODULE FORM */}
        <Card className="p-6 bg-muted/50 border-dashed">
            <h3 className="text-xl font-bold mb-4">Add a New Module</h3>
            <form onSubmit={handleAddModule} className="flex gap-4 items-end">
                <Input
                    id="new-module"
                    label="Module Title"
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit">Add Module</Button>
            </form>
        </Card>
      </div>
    </PageWrapper>
  );
}