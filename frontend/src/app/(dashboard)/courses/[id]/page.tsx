'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '../../../../../lib/api';
import Card from '../../../../../components/ui/Card';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
 
interface Lesson {
  id: string;
  title: string;
  content?: string;
  video_url?: string;
  duration?: number;
  order: number;
}
interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}
interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  level?: string;
  duration?: number;
  modules: Module[];

}

export default function CourseEditorPage() {
  const params = useParams();
  const courseId = params.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
 
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
 
  const [newLessonData, setNewLessonData] = useState<{ [key: number|string]: { title: string; video_url: string } }>({});

  const fetchCourse = async () => {
    if (!courseId) return;
    try { 

      // The `populate` query is essential to get modules and lessons in one call.
      const response = await fetchApi(`/api/courses/${courseId}?populate=*`);
      setCourse(response.data);  
    } catch (error) {
      console.error("Failed to fetch course", error);
    } finally {
      setLoading(false);
    }
  };
 console.log(course, 'course');
  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    try { 
      await fetchApi('/api/modules', {
        method: 'POST',
        body: JSON.stringify({data:{
          title: newModuleTitle,
          description: newModuleDescription,
          course: courseId 
        }}),
      });
      setNewModuleTitle('');
      setNewModuleDescription('');
      await fetchCourse(); // Re-fetch the course to show the new module
    } catch (error) {
      console.error("Failed to add module", error);
    }
  };

  const handleAddLesson = async (e: React.FormEvent, moduleId: string|number) => {
    e.preventDefault();
    const lessonData = newLessonData[moduleId];
    if (!lessonData || !lessonData.title) return;
    try { 
      await fetchApi('/api/lessons', {
        method: 'POST',
        body: JSON.stringify({data:{ 
          title: lessonData.title,
          videoUrl: lessonData.video_url,
          module: moduleId 
        }}),
      });
      setNewLessonData(prev => ({ ...prev, [moduleId]: { title: '', video_url: '' } }));
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
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Modules</h2> 
        {course.modules?.map((module:any) => (
          <Card key={module.id} className="p-6">
            <h3 className="text-xl font-bold">{module.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
            
            <ul className="mt-4 space-y-2 list-decimal list-inside"> 
              {module?.lessons && module?.lessons.map((lesson:any) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
            </ul>

            <form onSubmit={(e) => handleAddLesson(e, module.documentId)} className="mt-6 p-4 border-t border-border space-y-4">
              <h4 className="font-semibold">Add New Lesson</h4>
              <div className="flex gap-4 items-start">
                  <Input
                    id={`lesson-title-${module.id}`}
                    label="Lesson Title"
                    type="text"
                    value={newLessonData[module.id]?.title || ''}
                    onChange={(e) => setNewLessonData(prev => ({ ...prev, [module.id]: { ...prev[module.id], title: e.target.value } }))}
                    className="flex-grow"
                  />
                  <Input
                    id={`lesson-url-${module.id}`}
                    label="Video URL"
                    type="text"
                    value={newLessonData[module.id]?.video_url || ''}
                    onChange={(e) => setNewLessonData(prev => ({ ...prev, [module.id]: { ...prev[module.id], video_url: e.target.value } }))}
                    className="flex-grow"
                  />
                  <Button type="submit" variant="secondary" className="self-end">Add Lesson</Button>
              </div>
            </form>
          </Card>
        ))}
        
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