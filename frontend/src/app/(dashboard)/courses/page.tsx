'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../../lib/api';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

type Course = {
    id: number;
    title: string;
    description: string;
    documentId: string;
};
export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetchApi('/api/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    console.log(courses, 'courses in courses page');
    if (loading) {
        return <div className="text-center p-10">Loading courses...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Explore Courses</h1>
                <p className="text-muted-foreground mt-1">Browse our catalog of available courses.</p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course?.documentId} className="flex flex-col overflow-hidden">
                            <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold">{course?.title}</h3>
                                <p className="text-muted-foreground mt-2 text-sm line-clamp-3 flex-grow">
                                    {course?.description}
                                </p>
                                <div className="mt-4">
                                    <Link href={`/courses/${course?.documentId}`}>
                                        <Button variant="secondary" className="w-full">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center p-10">
                    <h2 className="text-xl font-semibold">No Courses Available</h2>
                    <p className="text-muted-foreground mt-2">
                        There are currently no courses in the catalog. Please check back later.
                    </p>
                </Card>
            )}
        </PageWrapper>
    );
}