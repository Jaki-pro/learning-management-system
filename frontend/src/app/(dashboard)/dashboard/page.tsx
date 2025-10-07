'use client';
import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { Enrollment } from '../../../../lib/types';
import { fetchApi } from '../../../../lib/api';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Card from '../../../../components/ui/Card';
import { useAuth } from '../../../../context/AuthContext';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchEnrollments = async () => {
      try {
        
        const enrollmentData = await fetchApi(
          `/api/enrollments?filters[user][id][$eq]=${user.id}&populate=course`
        );
        setEnrollments(enrollmentData.data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
    
  }, [user, authLoading, router, logout]);
  console.log(user, 'user in dashboard');
  if (authLoading || loading) {
    return <div className="text-center p-10">Loading your dashboard...</div>;
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Hello, {user?.username}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here are the courses youa re currently enrolled in.</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{enrollment.attributes.course.data.attributes.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm line-clamp-2">{enrollment.attributes.course.data.attributes.description}</p>
                <Link href={`/course/${enrollment.attributes.course.data.id}`} className="text-primary font-semibold mt-4 inline-block hover:underline">
                  Continue Learning →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-10">
            <h2 className="text-xl font-semibold">No Enrollments Yet!</h2>
            <p className="text-muted-foreground mt-2">You are not enrolled in any courses. Explore our catalog to get started.</p>
        </Card>
      )}
    </PageWrapper>
  );
}