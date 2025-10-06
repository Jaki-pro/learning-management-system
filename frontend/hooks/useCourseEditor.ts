import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import Fuse from 'fuse.js';

export function useCourseEditor(courseId: string) {
  const { role } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await fetchApi(`/api/courses/${courseId}?populate[modules][populate]=lessons`);
      setCourse(formatCourse(res));
    } catch (e) {
      console.error(e);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourse(); }, [courseId]);

  const fuse = useMemo(() => {
    if (!course) return null;
    return new Fuse(course.modules, { keys: ['title', 'lessons.title'], threshold: 0.3 });
  }, [course]);

  const filteredModules = useMemo(() => {
    if (!searchQuery || !fuse) return course?.modules ?? [];
    return fuse.search(searchQuery).map(r => r.item);
  }, [searchQuery, fuse, course]);

  return { role, course, loading, searchQuery, setSearchQuery, filteredModules, fetchCourse };
}

function formatCourse(raw: any) {
  if (!raw) return null;
  const payload = raw.data ?? raw;
  const attrs = payload.attributes ?? payload;
  const modulesRaw = (attrs.modules?.data ?? attrs.modules) || [];
  const modules = modulesRaw.map((m: any) => {
    const mAttrs = m.attributes ?? m;
    const lessonsRaw = (mAttrs.lessons?.data ?? mAttrs.lessons) || [];
    const lessons = lessonsRaw.map((l: any) => {
      const lAttrs = l.attributes ?? l;
      return { documentId: l.documentId ?? l.id, title: lAttrs.title, videoUrl: lAttrs.videoUrl };
    });
    return { documentId: m.documentId ?? m.id, title: mAttrs.title, description: mAttrs.description, lessons };
  });
  return { documentId: payload.documentId ?? payload.id, title: attrs.title, description: attrs.description, modules };
}
